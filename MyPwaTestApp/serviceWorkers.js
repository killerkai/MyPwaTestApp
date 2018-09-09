

'use strict';
var swName = "SW_kaa_v1";

self.addEventListener( 'push', function ( event )
{
    if ( event.data )
    {
        var objData = JSON.parse( event.data.text() );
        console.log( `[PUSH_kaa] Push had this data: "${event.data.text()}"` );
    } else
    {
        console.log( '[PUSH_kaa] Push had no data.' );
    }
    event.waitUntil(
        self.clients.matchAll().then( function ( clientList )
        {
            var focused = clientList.some( function ( client )
            {
                return client.focused;
            } );

            var notificationMessage;
            if ( focused )
            {
                notificationMessage = 'Du er fortsatt her, takk!';
            } else if ( clientList.length > 0 )
            {
                notificationMessage = 'Du har ikke lukket appen!'
            } else
            {
                notificationMessage = 'Du har lukket appen!'
            }
            var title = objData.title;            
            var options = {
                body: notificationMessage,
                icon: 'lib/img/icons/icon.png',
                badge: 'lib/img/icons/badge.png',
                image: 'lib/img/icons/' + objData.image,
                vibrate: [200, 50, 200],
                tag: objData.tag,
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1,
                    link: objData.link,
                    display: objData.display
                },
                actions: [
                    {
                        action: 'explore', title: 'Klikk',
                        icon: ''
                    },
                    {
                        action: 'close', title: 'Lukk',
                        icon: 'lib/img/icons/xmark.png'
                    },
                ]
            };
            return self.registration.showNotification( title, options );
        } )
    );
} );

//browser push notification "onClick" event heandler
self.addEventListener( 'notificationclick', function ( event )
{
    var notification = event.notification;
    var primaryKey = notification.data.primaryKey;
    var link = notification.data.link;
    var display = notification.data.display;
    var action = event.action;
    console.log( '[NTFC_kaa] Klikk motatt.' );
    var focused;

    if ( action === 'close' )
    {
        console.log( '[NTFC_kaa] Klikk lukk' );
        notification.close();
    } else
    {
        console.log( '[NTFC_kaa] Klikk link.' );
        event.notification.close();
        if ( display === 'ekstern' )
        {
            clients.openWindow( 'http://www.' + link );
        } else
        {

            /**
             * if exists open browser tab with matching url just set focus to it,
             * otherwise open new tab/window with sw root scope url
             */
            event.waitUntil( clients.matchAll( {
                type: "window"
            } ).then( function ( clientList )
            {
                for ( var i = 0; i < clientList.length; i++ )
                {
                    var client = clientList[i];
                    if ( client.url == self.registration.scope && 'focus' in client )
                    {
                        return client.focus();
                    }
                }
                if ( clients.openWindow )
                {
                    return clients.openWindow( '/' );
                }

            } ) );
        }
    }
} );


//This is the "Offline copy of pages" service worker

//Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener( 'install', function ( event )
{
    var indexPage = new Request( swName );
    event.waitUntil(
        fetch( indexPage ).then( function ( response )
        {
            return caches.open( swName ).then( function ( cache )
            {
                console.log( '[' + swName + '] Cached index page during Install' + response.url );
                return cache.put( indexPage, response );
            } );
        } ) );
} );

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener( 'fetch', function ( event )
{
    var updateCache = function ( request )
    {
        return caches.open( swName ).then( function ( cache )
        {
            return fetch( request ).then( function ( response )
            {
                console.log( '[' + swName + '] add page to offline' + response.url )
                return cache.put( request, response );
            } );
        } );
    };

    event.waitUntil( updateCache( event.request ) );

    event.respondWith(
        fetch( event.request ).catch( function ( error )
        {
            console.log( '[' + swName +'] Network request Failed. Serving content from cache: ' + error );

            //Check to see if you have it in the cache
            //Return response
            //If not in the cache, then return error page
            return caches.open( swName ).then( function ( cache )
            {
                return cache.match( event.request ).then( function ( matching )
                {
                    var report = !matching || matching.status == 404 ? Promise.reject( 'no-match' ) : matching;
                    return report
                } );
            } );
        } )
    );
} )

self.addEventListener( 'activate', function ( event )
{
    var cacheWhitelist = [ swName ];

    event.waitUntil(
        caches.keys().then( function ( keyList )
        {
            return Promise.all( keyList.map( function ( key )
            {
                if ( cacheWhitelist.indexOf( key ) === -1 )
                {
                    return caches.delete( key );
                }
            } ) );
        } )
    );
} );


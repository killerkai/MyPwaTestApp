/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';
var device;

const applicationServerPublicKey = 'BNpjLiH44q9XVT98b6YF80jIMlgpIk8trptoVcdujBMx9RDfeNDnmV2euFv5lSfDqlsMbiBFJ7h2HuelGPO4L4g';

const pushButton = document.querySelector( '.js-push-btn' );
const usbpushButton = document.querySelector( '.usb' );

let isSubscribed = false;
let swRegistration = null;

function usb()
{    
    navigator.usb.requestDevice( { filters: [{ vendorId: 0x2341 }] } )
        .then( selectedDevice =>
        {
            device = selectedDevice;
            return device.open(); // Begin a session.
        } )
        .then( () => device.selectConfiguration( 1 ) ) // Select configuration #1 for the device.
        .then( () => device.claimInterface( 2 ) ) // Request exclusive control over interface #2.
        .then( () => device.controlTransferOut( {
            requestType: 'class',
            recipient: 'interface',
            request: 0x22,
            value: 0x01,
            index: 0x02
        } ) ) // Ready to receive data
        .then( () => device.transferIn( 5, 64 ) ) // Waiting for 64 bytes of data from endpoint #5.
        .then( result =>
        {
            let decoder = new TextDecoder();
            console.log( 'Received: ' + decoder.decode( result.data ) );
        } )
        .catch( error => { console.log( error ); } );
}

function urlB64ToUint8Array( base64String )
{
    const padding = '='.repeat( ( 4 - base64String.length % 4 ) % 4 );
    const base64 = ( base64String + padding )
        .replace( /\-/g, '+' )
        .replace( /_/g, '/' );

    const rawData = window.atob( base64 );
    const outputArray = new Uint8Array( rawData.length );

    for ( let i = 0; i < rawData.length; ++i )
    {
        outputArray[i] = rawData.charCodeAt( i );
    }
    return outputArray;
}
if ( 'serviceWorker' in navigator && 'PushManager' in window )
{
    console.log( 'Service Worker and Push is supported' );

    navigator.serviceWorker.register( 'serviceWorkers.js' )
        .then( function ( swReg )
        {
            console.log( 'Service Worker is registered', swReg );

            swRegistration = swReg;
            initializeUI();
        } )
        .catch( function ( error )
        {
            console.error( 'Service Worker Error', error );
        } );
} else
{
    console.warn( 'Push messaging is not supported' );
    pushButton.textContent = 'Push Not Supported';
}
function initializeUI()
{
    usbpushButton.addEventListener( 'click', function ()
    {        
        usb();
    } );
    
    pushButton.addEventListener( 'click', function ()
    {
        pushButton.disabled = true;
        if ( isSubscribed )
        {
            unsubscribeUser();
        } else
        {
            subscribeUser();
        }
    } );

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then( function ( subscription )
        {
            isSubscribed = !( subscription === null );

            updateSubscriptionOnServer( subscription );

            if ( isSubscribed )
            {
                console.log( 'User is subscribed.' );
            } else
            {
                console.log( 'User is NOT subscribed.' );
            }

            updateBtn();
        } );
}
function updateBtn()
{
    if ( Notification.permission === 'denied' )
    {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer( null );
        return;
    }

    if ( isSubscribed )
    {
        pushButton.textContent = 'Disable Push Messaging';
    } else
    {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}
function subscribeUser()
{
    const applicationServerKey = urlB64ToUint8Array( applicationServerPublicKey );
    swRegistration.pushManager.subscribe( {
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    } )
        .then( function ( subscription )
        {
            console.log( 'User is subscribed.' );

            updateSubscriptionOnServer( subscription );

            isSubscribed = true;

            updateBtn();
        } )
        .catch( function ( err )
        {
            console.log( 'Failed to subscribe the user: ', err );
            updateBtn();
        } );
}
function updateSubscriptionOnServer( subscription )
{
    // TODO: Send subscription to application server

    const subscriptionJson = document.querySelector( '.js-subscription-json' );
    const subscriptionDetails =
        document.querySelector( '.js-subscription-details' );

    if ( subscription )
    {
        subscriptionJson.textContent = JSON.stringify( subscription );
        subscriptionDetails.classList.remove( 'is-invisible' );
    } else
    {
        subscriptionDetails.classList.add( 'is-invisible' );
    }
}
function unsubscribeUser()
{
    swRegistration.pushManager.getSubscription()
        .then( function ( subscription )
        {
            if ( subscription )
            {
                return subscription.unsubscribe();
            }
        } )
        .catch( function ( error )
        {
            console.log( 'Error unsubscribing', error );
        } )
        .then( function ()
        {
            updateSubscriptionOnServer( null );

            console.log( 'User is unsubscribed.' );
            isSubscribed = false;

            updateBtn();
        } );
}
//function displayNotification() {
//    if (Notification.permission == 'granted') {
//        navigator.serviceWorker.getRegistration().then(function (reg) {
//            var options = {
//                body: 'Here is a notification body!',
//                icon: 'images/example.png',
//                vibrate: [100, 50, 100],
//                data: {
//                    dateOfArrival: Date.now(),
//                    primaryKey: 1
//                }
//            };
//            reg.showNotification('Hello world!', options);
//        });
//    }
//}



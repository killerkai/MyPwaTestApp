// Site info
var DebugMode = true;

// Language
var SingleNonLanguageElements = {};
var SingleDefaultElements = {};
var SingleElements = {};
var ObjPageLanguage = {};

// Customer - User Info
var ObjCustomerInfo = {};
var ThisToday = "";
var ThisCustomer = "";
var ThisUserNo = "";
var ThisFirstName = "";
var ThisLastName = "";
var ThisEmail = "";
var ThisProfileImage = "";
var ThisLanguage = "en-US";
var ThisUserType = "";
var ThisUserTypeGrade = "";
var ThisUserTypeLevel = "";

// Div
var ObjJsonValidation = {};
var ThisLocation = "";
var ThisFormId = "";
var ThisPage = "";
var LanguagePage = "";
var ValidationPage = "";
var ArrayPageSize = [];

(function ($)
{
    var _$Obj = $({});
    $.each(
    {
        trigger: "publish",
        on: "subscribe",
        one: "subscribeonce",
        off: "unsubscribe"
    }, function (key, val)
    {
        jQuery[val] = function ()
        {
            _$Obj[key].apply(_$Obj, arguments);
        };
    });
})(jQuery);

function initializePage(Options, Callback)
{
    showCoverSpin();
    var _Defaults =
        {
            setAdjustStyle: false,
            setLanguageClientStorage: false,
            getCustomerInfo: false,
            setSystemMenu: false,
            getLanguage: false,
            getValidation: false,
            formStyle: false,
            setGridView: false,
            accordionIndex: "",
            brandingHeight: 46,
            navbarMenuAnimate: true
        };
    var _Options = $.extend({}, _Defaults, Options || {});

    ArrayPageSize = [window.innerWidth, window.innerHeight, $(window).scrollTop(), $(window).scrollLeft()];
    $(window).resize(function ()
    {
        if (_Options.setAdjustStyle)
        {
            adjustStyle();
        }
        ArrayPageSize = [window.innerWidth, window.innerHeight, $(window).scrollTop(), $(window).scrollLeft()];
    });
    ThisLocation = window.document.location.hostname;
    ThisPage = window.document.location.href;
    ThisFormId = window.document.forms[0].id;

    if (_Options.setAdjustStyle)
    {
        adjustStyle();
    }
    if (_Options.setLanguageClientStorage)
    {
        setLanguageClientStorage();
    }
    if (_Options.getCustomerInfo)
    {
        $.subscribeonce("functionlib/getCustomerInfo", function (e)
        {
            if (_Options.setSystemMenu)
            {
                setSystemMenu();
            }
            getSetLanguage();
        });
        getCustomerInfo();
    }
    else
    {
        getSetLanguage();
    }

    function getSetLanguage()
    {
        if (_Options.getLanguage)
        {
            $.subscribeonce("functionlib/getLanguage", function (e)
            {
                setLanguage();
                getSetValidation();
            });
            getLanguage(LanguagePage);
        }
        else
        {
            getSetValidation();
        }
    }

    function getSetValidation()
    {
        if (_Options.getValidation)
        {
            $.subscribeonce("validation/getValidation", function (e)
            {
                $.subscribeonce("validation/setValidation", function (e)
                {
                    getSetFormStyle();
                });
                setValidation();
            });
            getValidation(ValidationPage);
        }
        else
        {
            getSetFormStyle();
        }
    }

    function getSetFormStyle()
    {
        if (_Options.formStyle)
        {
            $.subscribeonce("validation/formStyle", function (e)
            {
                getSetGridView();
            });
            formStyle("#" + ThisFormId, _Options);
        }
        else
        {
            getSetGridView();
        }
    }

    function getSetGridView()
    {
        if (_Options.setGridView)
        {
            $.subscribeonce("functionlib/setGridView", function (e)
            {
                Callback();
            });
            setGridView("#" + ThisFormId);
        }
        else
        {
            Callback();
        }
    }
}

var initializeAjax = function (Options, ObjData)
{
    var _Defaults =
        {
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            timeout: 15000,
            exceptionAction: "dialog",
            exceptionErrorText: "",
            transferType: ""
        };
    var _Options = $.extend({}, _Defaults, Options || {});

    if (typeof ObjData === "object")
    {
        ObjData.hasOwnProperty("TransferType") === true ? _Options.transferType = ObjData.TransferType : "";
        _Options.data = JSON.stringify(ObjData);
        consoleLog(JSON.stringify(ObjData));
    }

    $.ajaxSetup({ cache: false });
    var _CurrentAjax = $.ajax(_Options).promise();

    _CurrentAjax.fail(function (jqXHR, textStatus, errorThrown)
    {
        var _statusText = jqXHR.statusText == "timeout" ? "Timeout" : _Options.exceptionErrorText;
        throwException(_Options.exceptionAction, "", ThisPage, _Options.transferType + ":Status:" + jqXHR.statusText, _statusText);
    });

    return _CurrentAjax;
}

// Language
function getLanguage(SelectedPage)
{
    $.ajaxSetup({ cache: false });
    $.getJSON(SelectedPage).done(function (data)
    {
        if (isEmpty(data) == false)
        {
            ObjPageLanguage = data;
            consoleLog("getLanguage");
            $.publish("functionlib/getLanguage");
        }
        else
        {
            throwException("dialog", "", ThisPage, "getLanguage-1", "Language");
        }
    }).fail(function (jqXHR, textStatus, err)
    {
        throwException("dialog", "", ThisPage, "getLanguage-2", "Language");
    });
}

function setLanguage()
{
    setFormLanguage(MyDefaultLanguage.ObjNonLanguageElements);
    SingleNonLanguageElements = MyDefaultLanguage.SingleNonLanguageElements;
    if (ThisLanguage != undefined)
    {
        setFormLanguage(MyDefaultLanguage.ObjDefaultElements[ThisLanguage]);
        SingleDefaultElements = MyDefaultLanguage.SingleDefaultElements[ThisLanguage];
        setFormLanguage(ObjPageLanguage.ObjElements[ThisLanguage]);
        SingleElements = ObjPageLanguage.SingleElements[ThisLanguage];
        document.title = SingleElements.labelPageTitle;
    }
    consoleLog("setLanguage");
    $.publish("functionlib/setLanguage");
}

function setFormLanguage(ObjElements)
{
    $.each(ObjElements, function (Key, Value)
    {
        $.each(Value, function (Key, Value)
        {
            if (Value.length == 2)
            {
                if (Value[0] == "html")
                {
                    $('#' + Key).html('');
                    $('#' + Key).html(Value[1]);
                }
                else if (Value[0] == "text")
                {
                    $('#' + Key).text('');
                    $('#' + Key).text(Value[1]);
                }
                else if (Value[0] == "val")
                {
                    $('#' + Key).val('');
                    $('#' + Key).val(Value[1]);
                }
                else if (Value[0] == "cmdlbl")
                {
                    $('#' + Key).button({ label: "" });
                    $('#' + Key).button({ label: "" + Value[1] + "" });
                }
                else if (Value[0] == "title")
                {
                    $('#' + Key).prop("title", "");
                    $('#' + Key).prop("title", Value[1]);
                }
                else if (Value[0] == "placeholder")
                {
                    $('#' + Key).prop("placeholder", "");
                    $('#' + Key).prop("placeholder", Value[1]);
                }
                else if (Value[0] == "htmlembedded")
                {
                    var _FirstChildElement = $('#' + Key + '>:first');
                    $('#' + Key).html('');
                    $('#' + Key).html(Value[1]);
                    $('#' + Key).prepend(_FirstChildElement);
                }
            }
            else if (Value.length == 3)
            {
                if (Value[0] == "id")
                {
                    if (Value[1] == "html")
                    {
                        $('#' + Key).html('');
                        $('#' + Key).html(Value[2]);
                    }
                    else if (Value[1] == "text")
                    {
                        $('#' + Key).text('');
                        $('#' + Key).text(Value[2]);
                    }
                    else if (Value[1] == "val")
                    {
                        $('#' + Key).val('');
                        $('#' + Key).val(Value[2]);
                    }
                    else if (Value[1] == "cmdlbl")
                    {
                        $('#' + Key).button({ label: "" });
                        $('#' + Key).button({ label: "" + Value[2] + "" });
                    }
                    else if (Value[1] == "title")
                    {
                        $('#' + Key).prop("title", "");
                        $('#' + Key).prop("title", Value[2]);
                    }
                    else if (Value[1] == "placeholder")
                    {
                        $('#' + Key).prop("placeholder", "");
                        $('#' + Key).prop("placeholder", Value[2]);
                    }
                    else if (Value[1] == "htmlembedded")
                    {
                        var _FirstChildElement = $('#' + Key + '>:first');
                        $('#' + Key).html('');
                        $('#' + Key).html(Value[2]);
                        $('#' + Key).prepend(_FirstChildElement);
                    }
                }
                else if (Value[0] == "class")
                {
                    if (Value[1] == "html")
                    {
                        $('.' + Key).html('');
                        $('.' + Key).html(Value[2]);
                    }
                    else if (Value[1] == "text")
                    {
                        $('.' + Key).text('');
                        $('.' + Key).text(Value[2]);
                    }
                    else if (Value[1] == "val")
                    {
                        $('.' + Key).val('');
                        $('.' + Key).val(Value[2]);
                    }
                    else if (Value[1] == "cmdlbl")
                    {
                        $('.' + Key).button({ label: "" });
                        $('.' + Key).button({ label: "" + Value[2] + "" });
                    }
                    else if (Value[1] == "title")
                    {
                        $('.' + Key).prop("title", "");
                        $('.' + Key).prop("title", Value[2]);
                    }
                    else if (Value[1] == "placeholder")
                    {
                        $('.' + Key).prop("placeholder", "");
                        $('.' + Key).prop("placeholder", Value[2]);
                    }
                    else if (Value[1] == "htmlembedded")
                    {
                        var _FirstChildElement = $('.' + Key + '>:first');
                        $('.' + Key).html('');
                        $('.' + Key).html(Value[1]);
                        $('.' + Key).prepend(_FirstChildElement);
                    }
                }
            }
        });
    });
    $.publish("functionlib/setFormLanguage");
}

function setLanguageClientStorage()
{
    var _CurrentLanguage = "";
    _CurrentLanguage = clientStorage("get", "language", "")
    if (_CurrentLanguage != null)
    {
        ThisLanguage = _CurrentLanguage;
    }
    else
    {
        clientStorage("set", "language", ThisLanguage);
    }
    consoleLog("setLanguageClientStorage");
    $.publish("functionlib/setLanguageClientStorage");
}

// Customer Info
function getCustomerInfo()
{
    ObjCustomerInfo = JSON.parse(clientStorage("get", "customerinfo", ""));
    if (isEmpty(ObjCustomerInfo) == false)
    {
        if (ObjCustomerInfo.hasOwnProperty("UserSignIn"))
        {
            ThisToday = ObjCustomerInfo.UserSignIn.Today
            ThisCustomer = ObjCustomerInfo.UserSignIn.CustomerName
            ThisUserNo = ObjCustomerInfo.UserSignIn.UserNo
            ThisFirstName = ObjCustomerInfo.UserSignIn.FirstName
            ThisLastName = ObjCustomerInfo.UserSignIn.LastName
            ThisEmail = ObjCustomerInfo.UserSignIn.Email
            ThisProfileImage = ObjCustomerInfo.UserSignIn.ProfileImage
            ThisLanguage = ObjCustomerInfo.UserSignIn.LanguageCode;
            ThisUserType = ObjCustomerInfo.UserSignIn.UserType
            ThisUserTypeGrade = ObjCustomerInfo.UserSignIn.UserTypeGrade
            ThisUserTypeLevel = ObjCustomerInfo.UserSignIn.UserTypeLevel;
            $('#cmdMenuActiveUser').text(ThisFirstName + " " + ThisLastName);
            moment.locale(ThisLanguage);
            consoleLog("getCustomerInfo");
            $.publish("functionlib/getCustomerInfo");
        }
        else
        {
            throwException("dialog", "", ThisPage, "getCustomerInfo-1", "LoadData");
        }
    }
    else
    {
        throwException("dialog", "", ThisPage, "getCustomerInfo-2", "LoadData");
    }
}

// Menu Content
function setSystemMenu()
{
    if (ObjCustomerInfo.hasOwnProperty("MainMenu"))
    {
        $.each(ObjCustomerInfo.MainMenu, function (i, MainMenuContent)
        {
            if (MainMenuContent.RoleFeatureStatus == "block")
            {
                $("." + MainMenuContent.Name + "_" + MainMenuContent.Type + ", #" + MainMenuContent.Name + "_" + MainMenuContent.Type).css({ "display": "block" });
            }
        });
        consoleLog("setSystemMenu");
        $.publish("functionlib/setSystemMenu");
    }
    else
    {
        throwException("dialog", "", ThisPage, "setSystemMenu-1", "LoadData");
    }
}

function openStandardAlert(SelectedTitle, SelectedText, SelectedAdditional, Modal)
{
    Modal = Modal === true ? true : false;
    if ($('#az-modal').length == 0)
    {
        $("body").append('<div id="az-modal-background"><div id="az-modal"><div class="az-modal-card"><header><h1 id="modalStandardTitle"></h1></header><article><div id="modalStandardText"></div><div id="modalStandardAdditional"></div></article></div></div></div>');
        $("#az-modal-background").css({ "display": "block" });
    }
    if (Modal == false)
    {
        $("#az-modal-background").off("click", closeStandardAlert).on("click", closeStandardAlert);
    }

    $("#modalStandardTitle, #modalStandardText, #modalStandardAdditional").empty();
    $("#modalStandardTitle").text(SelectedTitle);
    $("#modalStandardText").html(SelectedText);
    $("#modalStandardAdditional").html(SelectedAdditional);
    $.publish("functionlib/openStandardAlert");

    var _$AzModal = $("#az-modal");
    $(".az-modal-card > header", _$AzModal).off("click").on("click", function ()
    {
        closeStandardAlert();
    });
}

function closeStandardAlert()
{
    var _$Background = $("#az-modal-background");
    if (_$Background.length > 0)
    {
        $("#az-modal").slideUp(function ()
        {
            _$Background.remove();
            $("body").removeClass("az-alert-active");
        });
    }
}

function openStandardConfirm(SelectedTitle, SelectedText, SelectedButton1, SelectedButton2, FunctionToRun)
{
    var _HTML = "";
    if ($('#az-modal').length == 0)
    {
        $("body").append('<div id="az-modal-background"><div id="az-modal"><div class="az-modal-card"><header><h1 id="modalStandardTitle"></h1></header><article><div id="modalStandardText"></div><div id="modalStandardAdditional"></div></article></div></div></div>');
        $("#az-modal-background").css({ "display": "block" });
    }

    _HTML = '<div class="az-row az-margin-t-28">';
    _HTML += '<div class="az-col xs-6 az-text-right">';
    _HTML += '<button type="button" class="az-button az-shadow-1 az-shadow-hover-2 info" id="cmdStandardConfirmButton2" style="width: 50%; margin-right: 4px;">' + SelectedButton2 + '</button>';
    _HTML += '</div>';
    _HTML += '<div class="az-col xs-6 az-text-left">';
    _HTML += '<button type="button" class="az-button az-shadow-1 az-shadow-hover-2 primary" id="cmdStandardConfirmButton1" style="width: 50%; margin-left: 4px;">' + SelectedButton1 + '</button>';
    _HTML += '</div>';
    _HTML += '</div>';
    $("#modalStandardTitle, #modalStandardText, #modalStandardAdditional").empty();
    $("#modalStandardTitle").text(SelectedTitle);
    $("#modalStandardText").html(SelectedText);
    $("#modalStandardAdditional").html(_HTML);
    $("#cmdStandardConfirmButton2").off().on('click', function ()
    {
        closeStandardConfirm();
    });
    $("#cmdStandardConfirmButton1").off().on('click', function ()
    {
        closeStandardConfirm();
        FunctionToRun();
    });
    $.publish("functionlib/openStandardConfirm");

    var _$AzModal = $("#az-modal");
    $(".az-modal-card > header", _$AzModal).off("click").on("click", function ()
    {
        closeStandardConfirm();
    });
}

function closeStandardConfirm()
{
    var _$Background = $("#az-modal-background");
    if (_$Background.length > 0)
    {
        $("#az-modal").slideUp(function ()
        {
            _$Background.remove();
            $("body").removeClass("az-alert-active");
        });
    }
}

// Dialog
function initializeModalDialog(Options)
{
    var _Defaults =
        {
            dialogTitle: "",
            dialogWidth: 300,
            dialogHeight: 300,
            dialogStandardText: "",
            dialogStandardAdditional: "",
            dialogClose: function () { closeModalDialog(false) },
            dialogResizable: false,
            dialogDraggable: true
        };
    var _Options = $.extend({}, _Defaults, Options || {});

    if ($('#az-modal-dialog').length == 0)
    {
        $("body").append('<div id="az-modal-background"><div id="az-modal-dialog"><div class="az-modal-card"><article><div id="modalStandardText"></div><div id="modalStandardAdditional"></div></article></div></div></div>');
        $("#az-modal-background").css({ "display": "block" });

        $("#modalStandardText, #modalStandardAdditional").empty();
        $("#modalStandardText").html(_Options.dialogStandardText);
        $("#modalStandardAdditional").html(_Options.dialogStandardAdditional);
        $.publish("functionlib/initializeModalDialog");

        if (_Options.dialogWidth > $(window).width())
        {
            _Options.dialogWidth = ($(window).width() - 40);
        }
        if (_Options.dialogHeight > $(window).height())
        {
            _Options.dialogHeight = ($(window).height() - 40);
        }

        var _CurrentDialog = $("#az-modal-dialog").dialog(
            {
                autoOpen: false,
                modal: false,
                width: 'auto',
                height: 'auto',
                resizable: _Options.dialogResizable,
                draggable: _Options.dialogDraggable,
                closeOnEscape: true
            });

        _CurrentDialog.dialog("option", "title", _Options.dialogTitle);
        _CurrentDialog.dialog("option", "width", _Options.dialogWidth);
        _CurrentDialog.dialog("option", "height", _Options.dialogHeight);
        _CurrentDialog.dialog("open");
        _CurrentDialog.dialog({ close: function (event, ui) { _Options.dialogClose(); } });
    }
}

function closeModalDialog(LocationReload, FunctionToRun)
{
    if (FunctionToRun)
    {
        FunctionToRun();
    }
    window.setTimeout(function ()
    {
        $("#az-modal-dialog").dialog("close");
        var _$ModalDialog = $('#az-modal-dialog');
        if (_$ModalDialog.length > 0)
        {
            _$ModalDialog.remove();
        }
        var _$Background = $("#az-modal-background");
        if (_$Background.length > 0)
        {
            _$Background.remove();
        }
        if (LocationReload)
        {
            showCoverSpin();
            location.reload();
        }
    }, 100);
}

// Dialog iFrame
function setModaliFrame()
{
    if ($('#az-modal-iframe').length == 0)
    {
        $("body").append('<div id="az-modal-background"><div id="az-modal-iframe"><iframe id="az-iframe"></iframe></div></div>');
        $("#az-modal-background").css({ "display": "block" });
        $("#az-modal-iframe").dialog(
            {
                autoOpen: false,
                modal: false,
                width: 'auto',
                height: 'auto',
                resizable: false,
                draggable: true,
                closeOnEscape: true
            });
    }
}

function closeModaliFrame(LocationReload, FunctionToRun)
{
    if (FunctionToRun)
    {
        FunctionToRun();
    }
    window.setTimeout(function ()
    {
        $("#az-modal-iframe").dialog("close");
        $("#az-iframe").attr('src', '');
        var _$ModaliFrame = $('#az-modal-iframe');
        if (_$ModaliFrame.length > 0)
        {
            _$ModaliFrame.remove();
        }
        var _$Background = $("#az-modal-background");
        if (_$Background.length > 0)
        {
            _$Background.remove();
        }
        if (LocationReload)
        {
            showCoverSpin();
            location.reload();
        }
    }, 100);
}

// Modal Help
function modalHelp(SelectedPage)
{
    $("#modalStandardTitle, #modalStandardText, #modalStandardAdditional").empty();
    var _ModalHelpAdditional = $("#modalHelpAdditional").html();
    if (_ModalHelpAdditional != "" && _ModalHelpAdditional != null && _ModalHelpAdditional != undefined)
    {
        $("#modalStandardText").html(SingleElements[SelectedPage + "-text"] + _ModalHelpAdditional);
        if (typeof modalHelpAdditional == "function")
        {
            modalHelpAdditional();
            setModalHelp();
        }
    }
    else
    {
        $("#modalStandardText").html(SingleElements[SelectedPage + "-text"]);
        setModalHelp();
    }

    function setModalHelp()
    {
        $("#modalStandardTitle").text(SingleElements[SelectedPage + "-title"]);
        $("#modalStandardAdditional").html(SingleNonLanguageElements.defaultTeamAndLogo);
        $('#modalStandard').modal("show");
        setCSSInlineStyle("#modalStandard");
    }
}

function confirmCancel(FunctionToRun)
{
    if (formdirty == true)
    {
        openStandardConfirm(SingleDefaultElements.cancelDialogConfirmTitle, SingleDefaultElements.cancelDialogConfirmText, SingleDefaultElements.cancelDialogConfirmButton1, SingleDefaultElements.cancelDialogConfirmButton2, FunctionToRun);
    }
    else
    {
        showCoverSpin();
        FunctionToRun();
    }
}

function submitCancel(FunctionToRun)
{
    showCoverSpin();
    FunctionToRun();
}

function showCoverSpin()
{
    var _$CoverSpin = $("#az-cover-spin");
    if (_$CoverSpin.length == 0)
    {
        $("body").append('<div id="az-cover-spin"></div>');
    }
}

function hideCoverSpin()
{
    var _$CoverSpin = $("#az-cover-spin");
    if (_$CoverSpin.length > 0)
    {
        _$CoverSpin.remove();
    }
}

function setAccordion(SelectedIndex)
{
    var _$Accordion = $(".az-accordion");
    var _$AllAccordionCard = _$Accordion.children(".az-accordion-card");
    _$Accordion.off().on("click", ".az-accordion-card > header", function (e)
    {
        var _$SelectedHeader = $(this);
        if (_$SelectedHeader.siblings("article").is(":hidden"))
        {
            _$AllAccordionCard.children("article").slideUp(300);
            _$AllAccordionCard.children("header").removeClass("accordion-active");
            _$SelectedHeader.siblings("article").slideDown(300);
            _$SelectedHeader.addClass("accordion-active");
        }
        else
        {
            _$AllAccordionCard.children("article").slideUp(300);
            _$AllAccordionCard.children("header").removeClass("accordion-active");
        }
    });
    if (SelectedIndex != undefined && typeof SelectedIndex === "number")
    {
        var _$SelectedAccordionCard = $(".az-accordion > .az-accordion-card").eq(SelectedIndex);
        var _$SelectedHeader = _$SelectedAccordionCard.children("header");
        if (_$SelectedHeader.siblings("article").is(":hidden"))
        {
            _$AllAccordionCard.children("article").slideUp(300);
            _$AllAccordionCard.children("header").removeClass("accordion-active");
            _$SelectedHeader.siblings("article").slideDown(300);
            _$SelectedHeader.addClass("accordion-active");
        }
        else
        {
            _$AllAccordionCard.children("article").slideUp(300);
            _$AllAccordionCard.children("header").removeClass("accordion-active");
        }
    }
}

function openCloseNavbarMobile()
{
    var _$NavbarTopContent = $(".az-navbar-top-content");
    if (_$NavbarTopContent.hasClass("mobile"))
    {
        _$NavbarTopContent.removeClass("mobile");
    }
    else
    {
        _$NavbarTopContent.addClass("mobile");
    }
}

function closeNavbarMobile()
{
    var _$NavbarTopContent = $(".az-navbar-top-content");
    if (_$NavbarTopContent.hasClass("mobile"))
    {
        _$NavbarTopContent.removeClass("mobile");
    }
}

var _$NavbarBranding = {};
function setNavbarBranding(BrandingHeight)
{
    _$NavbarBranding = $(".az-navbar-branding");
    if (_$NavbarBranding.length > 0)
    {
        _$NavbarBranding.css(
        {
            "display": "block",
            "height": BrandingHeight
        });
    }
}

var _$PortfolioMenu = {};
var _$PortfolioMenu = {};
function setPortfolio()
{
    var _MaxHeight = 0;
    _$PortfolioMenu = $(".az-portfolio-menu");
    _$PortfolioContent = $(".az-portfolio-content");
    _$PortfolioMenu.off().on("click", "li", function (e)
    {
        var _$MenuFilter = $(this).attr('data-filter');
        if (_$MenuFilter == "*")
        {
            _$PortfolioContent.children("li").removeClass("az-portfolio-content-hidden");
        }
        else
        {
            _$PortfolioContent.children("li").not(_$MenuFilter).addClass("az-portfolio-content-hidden");
            _$PortfolioContent.children(_$MenuFilter).removeClass("az-portfolio-content-hidden");
        }
    });
    if ($(".az-portfolio-content-hidden", _$PortfolioContent).length == 0)
    {
        _$PortfolioContent.height(0);
        _$PortfolioContent.height(_$PortfolioContent.parent().height() + 28);
    }
}

function setDropdownClickEvent(e)
{
    var _Element = e.target || e.srcElement;
    var _$ULDropdown = $(_Element).next(".az-ul-dropdown");
    $(".az-dropdown-show").not(_$ULDropdown).each(function ()
    {
        $(this).removeClass("az-dropdown-show");
    });
    if (_$ULDropdown.hasClass("az-dropdown-show"))
    {
        _$ULDropdown.removeClass("az-dropdown-show");
    }
    else
    {
        _$ULDropdown.addClass("az-dropdown-show");
        window.setTimeout(function () { $(document).one("click", { ULDropdown: _$ULDropdown }, removeDropdownEvent); }, 100);
    }
}

function removeDropdownEvent(e)
{
    var _Element = e.target || e.srcElement;
    var _$ULDropdown = e.data.ULDropdown;
    if ($(_Element) != _$ULDropdown)
    {
        if (_$ULDropdown.hasClass("az-dropdown-show"))
        {
            _$ULDropdown.removeClass("az-dropdown-show");
        }
    }
}

function changeInOut(_ElementIn, _ElementOut)
{
    if ($("#" + _ElementIn + "").is(":hidden"))
    {
        $("#" + _ElementIn + "").slideDown("slow");
        $("#" + _ElementOut + "").slideUp("slow");
    }
    else
    {
        $("#" + _ElementIn + "").slideUp("slow");
        $("#" + _ElementOut + "").slideDown("slow");
    }
}

function formatDateTime(SelectedDateTime, FormatType)
{
    if (moment(SelectedDateTime).isValid() == true)
    {
        return moment(SelectedDateTime).format(FormatType);
    }
    else
    {
        return "";
    }
}

function formatTime(SelectedTime)
{
    if (SelectedTime != "" && SelectedTime != null && SelectedTime != undefined)
    {
        return SelectedTime;
    }
    else
    {
        return "";
    }
}

function hideShowPassword(e)
{
    var SelectedElementId = "";
    var _Element = e.target || e.srcElement;
    if ($(_Element).hasClass("passwordeye"))
    {
        SelectedElementId = $(_Element).attr("data-connectedid");
    }
    else
    {
        if ($(_Element).parent().hasClass("passwordeye"))
        {
            SelectedElementId = $(_Element).parent().attr("data-connectedid");
        }
    }
    if (SelectedElementId != "")
    {
        var _$PasswordField = $("#" + SelectedElementId)[0];
        if (_$PasswordField.type == "password")
        {
            if (_$PasswordField.value != "")
            {
                _$PasswordField.type = "text";
            }
        }
        else
        {
            _$PasswordField.type = "password";
        }
    }
}

function setGridView(SelectedArea)
{
    if (isEmpty(ObjJsonValidation) == false)
    {
        var _SelectedArea = "";
        if (SelectedArea != "" && SelectedArea != undefined && SelectedArea != null)
        {
            _SelectedArea = $(SelectedArea);
        }
        else
        {
            _SelectedArea = "";
        }

        var _$Header = "";
        $(".HeaderStyle > th", _SelectedArea).each(function (index) 
        {
            _$Header = $(this);
            if (ObjJsonValidation.hasOwnProperty($("a", _$Header).text()) && ObjJsonValidation[$("a", _$Header).text()].sort == true)
            {
                $("a", _$Header).text(SingleElements["label" + $("a", _$Header).text()]);
            }
            else
            {
                _$Header.text(SingleElements["label" + $("a", _$Header).text()]);
            }
        });

        var _ObjJsonReturn = {};
        var _ObjSpanCheckBox = {};
        var _ObjCheckBox = {};
        $(".RowStyle > td, .AlternatingRowStyle > td", _SelectedArea).each(function (index)
        {
            _ObjJsonReturn = getSelectedObj(ObjJsonValidation, "tabindex", $(this).index());
            if (_ObjJsonReturn.datatype == "date")
            {
                $(this).text(moment($(this).text()).format('L'));
            }
            else if (_ObjJsonReturn.datatype == "datetime")
            {
                $(this).text(moment($(this).text()).format('L') + " - " + moment($(this).text()).format('LT'));
            }
            else if (_ObjJsonReturn.datatype == "time")
            {
                $(this).text(moment('01/01/1900 ' + $(this).text()).format('LT'));
            }
            else if (_ObjJsonReturn.datatype == "militarytime")
            {
                $(this).text(moment('01/01/1900 ' + $(this).text()).format('HH:mm'));
            }
            else if (_ObjJsonReturn.datatype == "decimal")
            {
                $(this).text(numeral($(this).text()).format('0.00'));
            }
            else if (_ObjJsonReturn.datatype == "bytes")
            {
                $(this).text(bytesToSize($(this).text()));
            }
            else if (_ObjJsonReturn.datatype == "int")
            {
                $(this).text(SingleElements["label" + $(this).text()]);
            }

            if ($(this).children().is("span") == true)
            {
                _ObjSpanCheckBox = $(this).children();
                _ObjCheckBox = _ObjSpanCheckBox.find(":input");
                if (_ObjCheckBox.is(":input") == true)
                {
                    _ObjCheckBox.attr("id", _ObjSpanCheckBox.attr("data-id"));
                    _ObjCheckBox.addClass("az-checkbox");
                }
            }
        });
        $(window).one("beforeunload", function (e) { showCoverSpin() });
        $.publish("functionlib/setGridView");
    }
    else
    {
        throwException("dialog", "", ThisPage, "setGridView-1", "LoadData");
    }
}


function disableButton($Selector)
{
    if (!$Selector.hasClass("az-button-disabled"))
    {
        $Selector.addClass("az-button-disabled");
        $Selector.prop("disabled", true);
    }
}

function enableButton($Selector)
{
    if ($Selector.hasClass("az-button-disabled"))
    {
        $Selector.removeClass("az-button-disabled");
        $Selector.prop("disabled", false);
    }
}

function forceUppercaseFocusout(e)
{
    var _Element = e.target || e.srcElement;
    $(_Element).val($(_Element).val().toUpperCase());
}

function forceLowercaseFocusout(e)
{
    var _Element = e.target || e.srcElement;
    $(_Element).val($(_Element).val().toLowerCase());
}

function bytesToSize(bytes, decimalPoint)
{
    if (bytes == 0) return '0 Bytes';
    var k = 1000;
    var dm = decimalPoint || 2;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getURLParameters(sPageURL)
{
    var result = {};
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        result[sParameterName[0]] = sParameterName[1];
    }
    return result;
}

$.urlParam = function (name)
{
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null)
    {
        return null;
    }
    else
    {
        return results[1] || 0;
    }
}

function isEmpty(SelectedObj)
{
    if (SelectedObj instanceof Object)
    {
        if (SelectedObj == null)
        {
            return true;
        }
        for (var key in SelectedObj)
        {
            if (SelectedObj.hasOwnProperty(key))
            {
                return false;
            }
        }
        return true;
    }
    else
    {
        return true;
    }
}

function navigateTo(SelectedPage, SelectedTarget)
{
    SelectedTarget = SelectedTarget === true ? true : false;
    if (SelectedTarget == 0)
    {
        window.location.href = SelectedPage;
    }
    else
    {
        window.open(SelectedPage, SelectedTarget);
    }
}

function azInputAnimatedFocusout(e)
{
    var _Element = e.target || e.srcElement;
    if ($(_Element).val() != "")
    {
        $('label[for="' + _Element.id + '"]').css({ "top": "-15px" });
    }
    else
    {
        $('label[for="' + _Element.id + '"]').removeAttr('style');
    }
}

function azLabelAnimatedClick(e)
{
    var _Element = e.target || e.srcElement;
    $(_Element).siblings(":input").focus();
}

function getSelectedObj(_SelectedList1, _SelectedKey, _SelectedVal)
{
    var _ThisReturn = "";
    $.each(_SelectedList1, function (i, _SelectedObj1)
    {
        $.each(_SelectedObj1, function (_Key1, _Value1)
        {
            if (toString.call(_Value1) === "[object Array]" && _Value1.length > 0)
            {
                $.each(_Value1, function (i, _SelectedObj2)
                {
                    $.each(_SelectedObj2, function (_Key2, _Value2)
                    {
                        if (_SelectedKey.toString().toLowerCase() == _Key2.toString().toLowerCase() && _SelectedVal.toString().toLowerCase() == _Value2.toString().toLowerCase())
                        {
                            _ThisReturn = _SelectedObj2;
                            return false;
                        }
                    });
                });
            }
            else
            {
                if (_SelectedKey.toString().toLowerCase() == _Key1.toString().toLowerCase() && _SelectedVal.toString().toLowerCase() == _Value1.toString().toLowerCase())
                {
                    _ThisReturn = _SelectedObj1;
                    return false;
                }
            }
        });
    });
    return _ThisReturn;
}

function removeSelectedObj(_SelectedObj, _SelectedKey)
{
    $.each(_SelectedObj, function (i, Selected)
    {
        if (_SelectedObj[i].UserId.toString().toLowerCase() == _SelectedKey.toString().toLowerCase())
        {
            _SelectedObj.splice(i, 1);
            return false;
        }
    });
}

// Error exception
function throwException(_Action, _ActionPath, _ErrorPage, _ErrorCode, _ErrorText)
{
    if (_Action === "navigate")
    {
        navigateTo(_ActionPath + "?ErrorPage=" + _ErrorPage + "&ErrorCode=" + _ErrorCode + "&ErrorText=" + _ErrorText, 0);
    }
    else if (_Action === "dialog")
    {
        hideCoverSpin();
        openStandardAlert(SingleDefaultElements.informationTitle, SingleDefaultElements[_ErrorText + "Error"] + "<br><br>" + _ErrorCode + " - " + _ErrorText + "<br><br>" + AppName + " / " + AppVersion, SingleNonLanguageElements.defaultTeamAndLogo, true);
    }
    else if (_Action === "silent")
    {
        consoleLog({ consoleType: "error", consoleText: _ErrorCode });
    }
    //var _OutputElements = {};
    //_OutputElements["AppSettingId"] = 0;
    //_OutputElements["Device"] = "Desktop";
    //_OutputElements["DeviceInfo"] = JSON.stringify(navigator.userAgent);
    //_OutputElements["PageName"] = _ErrorPage.replace(/\//g, '');
    //_OutputElements["TransferType"] = _ErrorText;
    //_OutputElements["Error"] = _ErrorCode;
    //createErrorLog(_OutputElements);
}

function consoleLog(Options)
{
    var _Defaults =
        {
            consoleType: "log",
        };

    var _Options;
    if (typeof Options === "string" || typeof Options === "number")
    {
        _Options = $.extend({}, _Defaults, { consoleText: Options });
    }
    else if (typeof Options === "object")
    {
        Options.hasOwnProperty("consoleType") === true ? _Defaults.consoleType = Options.consoleType : "";
        Options.hasOwnProperty("consoleText") === true ? _Defaults.consoleText = JSON.parse(JSON.stringify(Options.consoleText)) : _Defaults.consoleText = JSON.parse(JSON.stringify(Options));
        _Options = _Defaults;
    }
    else
    {
        _Options = $.extend({}, _Defaults, Options || {});
    }
    if (DebugMode)
    {
        console[_Options.consoleType](AppName + '\n' + _Options.consoleText);
    }
}

// Client Storage
function clientStorage(ActionType, Name, Value)
{
    var _ThisLocation = window.document.location.hostname;
    var _LocalStorageEnabled = checkLocalStorage();
    if (typeof Value === "object")
    {
        Value = JSON.stringify(Value);
    }
    if (_LocalStorageEnabled == true)
    {
        if (ActionType == "set")
        {
            setLocalStorage(_ThisLocation + "-" + Name, Value);
        }
        else if (ActionType == "get")
        {
            return getLocalStorage(_ThisLocation + "-" + Name);
        }
        else if (ActionType == "remove")
        {
            removeLocalStorage(_ThisLocation + "-" + Name);
        }
        else
        {
            clientStorageError("Local Storage: Wrong action type.");
        }
    }
    else
    {
        var _CookieEnabled = checkCookie();
        if (_CookieEnabled == true)
        {
            if (ActionType == "set")
            {
                setCookie(_ThisLocation + "-" + Name, _Value);
            }
            else if (ActionType == "get")
            {
                return getCookie(_ThisLocation + "-" + Name);
            }
            else if (ActionType == "remove")
            {
                removeCookie(_ThisLocation + "-" + Name);
            }
            else
            {
                clientStorageError("Cookies: Wrong action type.");
            }
        }
        else
        {
            clientStorageError("Local Storage / Cookies not supported.");
        }
    }
}

// Local Storeage
function checkLocalStorage()
{
    try
    {
        var _SupportsLocalStorage = !!window.localStorage && typeof localStorage.getItem === 'function' && typeof localStorage.setItem === 'function' && typeof localStorage.removeItem === 'function';
        if (_SupportsLocalStorage)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch (e)
    {
        return false;
    }
}

function setLocalStorage(LSName, LSValue)
{
    localStorage.setItem(LSName, LSValue);
}

function getLocalStorage(LSName)
{
    return localStorage.getItem(LSName);
}

function removeLocalStorage(LSName)
{
    localStorage.removeItem(LSName);
}

// Cookies
function checkCookie()
{
    try
    {
        if (navigator.cookieEnabled)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch (e)
    {
        return false;
    }
}

function setCookie(CName, CValue)
{
    var _Date = new Date();
    _Date.setTime(_Date.getTime() + (365 * 24 * 60 * 60 * 1000));
    var _Expires = "expires=" + _Date.toUTCString();
    document.cookie = CName + "=" + CValue + "; " + _Expires;
}

function getCookie(CName)
{
    var _Name = CName + "=";
    var _DecodedCookie = decodeURIComponent(document.cookie);
    var _CA = _DecodedCookie.split(';');
    for (var i = 0; i < _CA.length; i++)
    {
        var _C = _CA[i];
        while (_C.charAt(0) == ' ')
        {
            _C = _C.substring(1);
        }
        if (_C.indexOf(_Name) == 0)
        {
            return _C.substring(_Name.length, _C.length);
        }
    }
    return "";
}

function removeCookie(CName)
{
    document.cookie = CName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function clientStorageError(consoleText)
{
    console.error("Client Storage Error\n" + consoleText);
}

var _WindowWidth = 0;
function adjustStyle()
{
    if ($("#div-window-size").length == 0)
    {
        $("body").append('<div id="div-window-size" style="position: fixed; z-index: 499999; left: 0; bottom: 0; width: 100%; height: 20px; text-align: center;"></div>');
    }

    _WindowWidth = parseInt(window.innerWidth);
    if (_WindowWidth > 1199)
    {
        $("#div-window-size").css({ "background-color": "#337ab7", "color": "#ffffff" }).html("xl - (1200 - &#8734) - " + _WindowWidth + " px");
    }
    else if (_WindowWidth > 991 && _WindowWidth < 1200)
    {
        $("#div-window-size").css({ "background-color": "#5cb85c", "color": "#ffffff" }).html("lg - (992 - 1199) - " + _WindowWidth + " px");
    }
    else if (_WindowWidth > 767 && _WindowWidth < 993)
    {
        $("#div-window-size").css({ "background-color": "#5bc0de", "color": "#ffffff" }).html("md - (768 - 991) - " + _WindowWidth + " px");
    }

    else if (_WindowWidth > 576 && _WindowWidth < 768)
    {
        $("#div-window-size").css({ "background-color": "#f0ad4e", "color": "#ffffff" }).html("sm - (577 - 767) - " + _WindowWidth + " px");
    }
    else
    {
        $("#div-window-size").css({ "background-color": "#d9534f", "color": "#ffffff" }).html("xs - (0 - 576) - " + _WindowWidth + " px");
    }
}

function getValidation(SelectedPage)
{
    $.ajaxSetup({ cache: false });
    $.getJSON(SelectedPage).done(function (data)
    {
        if (data instanceof Object && data != null && data != undefined)
        {
            ObjJsonValidation = data;
            consoleLog("getValidation");
            $.publish("validation/getValidation");
        }
        else
        {
            throwException("dialog", "", ThisPage, "getValidation-1", "Validation");
        }
    }).fail(function (jqXHR, textStatus, err)
    {
        throwException("dialog", "", ThisPage, "getValidation-2", "Validation");
    });
}

function setValidation(SelectedArea)
{
    var _$Selector = {};
    if (SelectedArea != "" && SelectedArea != undefined && SelectedArea != null)
    {
        _SelectedArea = $(SelectedArea);
    }
    else
    {
        _SelectedArea = "";
    }

    $.each(ObjJsonValidation, function (HTMLElement, ObjJsonSubValidation)
    {
        $("." + HTMLElement).each(function (AttrType, AttrValue)
        {
            if (AttrValue.id)
            {
                if (ObjJsonValidation.hasOwnProperty(AttrValue.id) == false)
                {
                    ObjJsonValidation[AttrValue.id] = ObjJsonSubValidation;
                }
            }
        });
    });

    $.each(ObjJsonValidation, function (HTMLElement, ObjJsonSubValidation)
    {
        $.each(ObjJsonSubValidation, function (AttrType, AttrValue)
        {
            if (AttrType.toLowerCase() == "label")
            {
                $("label[for='" + HTMLElement + "']", _SelectedArea).addClass(AttrValue);
            }
            else if (AttrType.toLowerCase() == "data-attr" || AttrType.toLowerCase() == "minlength" || AttrType.toLowerCase() == "maxlength" || AttrType.toLowerCase() == "tabindex")
            {
                if ($('#' + HTMLElement, _SelectedArea).length > 0)
                {
                    $('#' + HTMLElement, _SelectedArea).attr(AttrType, AttrValue);
                }
                if ($('.' + HTMLElement, _SelectedArea).length > 0)
                {
                    $('.' + HTMLElement, _SelectedArea).attr(AttrType, AttrValue);
                }
            }
            else if (AttrType.toLowerCase() == "class")
            {
                if ($('#' + HTMLElement, _SelectedArea).length > 0)
                {
                    $('#' + HTMLElement, _SelectedArea).addClass(AttrValue);
                }
                if ($('.' + HTMLElement, _SelectedArea).length > 0)
                {
                    $('.' + HTMLElement, _SelectedArea).addClass(AttrValue);
                }
            }
        });
    });
    consoleLog("setValidation");
    $.publish("validation/setValidation");
}

function getValidateType(SelectedType)
{
    var validTypes =
        {
            "validate-alpha": "1234567890abcdefghijklmnopqrstuvwxyzæøå!@#%&()?*+-_,;.:/\u0020\u0027\u000a",
            "validate-numeric": "1234567890",
            "validate-email": "1234567890abcdefghijklmnopqrstuvwxyz-_.@",
            "validate-web": "1234567890abcdefghijklmnopqrstuvwxyz-_.:/",
            "validate-userpass": "1234567890abcdefghijklmnopqrstuvwxyz-_.@",
            "validate-connectionid": "abcdefghijklmnopqrstuvwxyz",
            "validate-date": "1234567890./",
            "validate-time": "1234567890:",
            "validate-float": "1234567890."
        }
    return validTypes[SelectedType];
}

function formStyle(SelectedArea, Options)
{
    var _Defaults =
        {
            accordionIndex: "",
            brandingHeight: 46
        };
    var _Options = $.extend({}, _Defaults, Options || {});

    var _ElementClass = "";
    if (SelectedArea != "" && SelectedArea != undefined && SelectedArea != null)
    {
        _SelectedArea = $(SelectedArea);
    }
    else
    {
        _SelectedArea = "";
    }

    $(":input", _SelectedArea).each(function ()
    {
        if ($(this).is("[type='text'], [type='password'], [type='datetime'], [type='datetime-local'], [type='date'], [type='month'], [type='time'], [type='week'], [type='number'], [type='email'], [type='url'], [type='search'], [type='tel'], [type='color']"))
        {
            $(this).attr("autocomplete", "off");
            if ($(this).hasClass("validate"))
            {
                $(this).off("keyup", validateDirty).on("keyup", validateDirty);

                _ElementClass = "";
                _ElementClass = $(this).attr("class").match(/[\w-]*validate-[\w-]*/g);
                if (_ElementClass != null)
                {
                    $(this).off("keypress", validateValue).on("keypress", { ElementClass: _ElementClass, SelectedArea: _SelectedArea }, validateValue);
                }
            }
            if ($(this).hasClass("az-input-animated"))
            {
                $(this).off("focusout", azInputAnimatedFocusout).on("focusout", azInputAnimatedFocusout);
            }
            if ($(this).hasClass("forceuppercase"))
            {
                $(this).off("focusout", forceUppercaseFocusout).on("focusout", forceUppercaseFocusout);
            }
            if ($(this).hasClass("forcelowercase"))
            {
                $(this).off("focusout", forceLowercaseFocusout).on("focusout", forceLowercaseFocusout);
            }

            // TODO
            if ($(this).hasClass("donotpaste"))
            {
                $(this).keydown(function (e)
                {
                    if (e.ctrlKey == true && (e.which == 118 || e.which == 86))
                    {
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    }
                });
            }
            if ($(this).hasClass("notenter"))
            {
                $(this).keypress(function (e)
                {
                    if ((e.keyCode || e.which) == 13)
                    {
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    }
                });
            }
            if ($(this).hasClass("readonly"))
            {
                $(this).prop("readOnly", true);
            }
            if ($(this).hasClass("disabled"))
            {
                $(this).prop("disabled", true);
            }
            if ($(this).hasClass("selecttext"))
            {
                $(this).click(function (e)
                {
                    $(this).select();
                });
            }
            if ($(this).hasClass("date"))
            {
                $(this).datepicker
                    ({
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("pastdate"))
            {
                $(this).datepicker
                    ({
                        maxDate: 0,
                        yearRange: "-60:+0",
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("nopastdate"))
            {
                $(this).datepicker(
                    {
                        minDate: 0,
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("fromdate"))
            {
                $(this).datepicker(
                    {
                        numberOfMonths: 2,
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            $(".todate").datepicker("option", "minDate", curDate);
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("todate"))
            {
                $(this).datepicker(
                    {
                        numberOfMonths: 2,
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            $(".fromdate").datepicker("option", "maxDate", curDate);
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("frompastdate"))
            {
                $(this).datepicker(
                    {
                        maxDate: 0,
                        numberOfMonths: 2,
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            $(".topastdate").datepicker("option", "minDate", curDate);
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("topastdate"))
            {
                $(this).datepicker(
                    {
                        maxDate: 0,
                        numberOfMonths: 2,
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            $(".frompastdate").datepicker("option", "maxDate", curDate);
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("fromnopastdate"))
            {
                $(this).datepicker(
                    {
                        minDate: 0,
                        numberOfMonths: 2,
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            $(".tonopastdate").datepicker("option", "minDate", curDate);
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("tonopastdate"))
            {
                $(this).datepicker(
                    {
                        minDate: 0,
                        numberOfMonths: 2,
                        onSelect: function (curDate, instance)
                        {
                            validateDirty();
                            $(".fromnopastdate").datepicker("option", "maxDate", curDate);
                            if (typeof setDate == 'function')
                            {
                                setDate(curDate, instance);
                            }
                        }
                    });
            }
            if ($(this).hasClass("date") || $(this).hasClass("pastdate") || $(this).hasClass("nopastdate") || $(this).hasClass("fromdate") || $(this).hasClass("todate") || $(this).hasClass("topastdate") || $(this).hasClass("frompastdate") || $(this).hasClass("fromnopastdate") || $(this).hasClass("tonopastdate"))
            {
                $.datepicker.setDefaults($.datepicker.regional[ThisLanguage]);
                $(".ui-datepicker").css({ "font-size": "0.95em" });
            }
        }
        if ($(this).is("textarea"))
        {
            $(this).attr("autocomplete", "false");
            if ($(this).hasClass("validate"))
            {
                $(this).off("keyup", validateDirty).on("keyup", validateDirty);

                _ElementClass = "";
                _ElementClass = $(this).attr("class").match(/[\w-]*validate-[\w-]*/g);
                if (_ElementClass != null)
                {
                    $(this).off("keypress", validateValue).on("keypress", { ElementClass: _ElementClass, SelectedArea: _SelectedArea }, validateValue);
                }
            }
            if ($(this).hasClass("forceuppercase"))
            {
                $(this).off("focusout", forceUppercaseFocusout).on("focusout", forceUppercaseFocusout);
            }
            if ($(this).hasClass("forcelowercase"))
            {
                $(this).off("focusout", forceLowercaseFocusout).on("focusout", forceLowercaseFocusout);
            }

            // TODO
            if ($(this).hasClass("donotpaste"))
            {
                $(this).keydown(function (e)
                {
                    if (e.ctrlKey == true && (e.which == 118 || e.which == 86))
                    {
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    }
                });
            }
            if ($(this).hasClass("notenter"))
            {
                $(this).keypress(function (e)
                {
                    if ((e.keyCode || e.which) == 13)
                    {
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    }
                });
            }
            if ($(this).hasClass("readonly"))
            {
                $(this).prop("readOnly", true);
            }
            if ($(this).hasClass("disabled"))
            {
                $(this).prop("disabled", true);
            }
            if ($(this).hasClass("selecttext"))
            {
                $(this).click(function (e)
                {
                    $(this).select();
                });
            }
        }
        if ($(this).is("[type='checkbox']"))
        {
            if ($(this).hasClass("validate"))
            {
                $(this).off("click", validateDirty).on("click", validateDirty);
            }
            if ($(this).hasClass("disabled"))
            {
                $(this).prop("disabled", true);
            }
        }
        if ($(this).is("[type='radio']"))
        {
            if ($(this).hasClass("validate"))
            {
                $(this).off("click", validateDirty).on("click", validateDirty);
            }
            if ($(this).hasClass("disabled"))
            {
                $(this).prop("disabled", true);
            }
        }
        if ($(this).is("select"))
        {
            if ($(this).hasClass("validate"))
            {
                $(this).off("change", validateDirty).on("change", validateDirty);
            }
            if ($(this).hasClass("readonly"))
            {
                $(this).prop("readOnly", true);
            }
            if ($(this).hasClass("disabled"))
            {
                $(this).prop("disabled", true);
            }
        }
        if ($(this).is("button"))
        {
            if ($(this).hasClass("validate"))
            {
                $(this).off("click", validateDirty).on("click", validateDirty);
            }
            if ($(this).hasClass("help"))
            {
                $(this).off("click", modalHelp).on("click", modalHelp);
            }
            if ($(this).hasClass("setmap"))
            {
                $(this).off("click", setGoogleMap).on("click", setGoogleMap);
            }
            if ($(this).hasClass("deletemap"))
            {
                $(this).off("click", deleteGoogleMap).on("click", deleteGoogleMap);
            }
            if ($(this).hasClass("cancel"))
            {
                $(this).off("click", verifyCancel).on("click", verifyCancel);
            }
            if ($(this).hasClass("submit"))
            {
                $(this).off("click", verifySubmit).on("click", verifySubmit);
            }
            if ($(this).hasClass("delete"))
            {
                $(this).off("click", verifyDelete).on("click", verifyDelete);
            }
            if ($(this).hasClass("az-navbar-button"))
            {
                $(this).off("click", openCloseNavbarMobile).on("click", openCloseNavbarMobile);
            }
            if ($(this).hasClass("disabled"))
            {
                disableButton($(this));
            }
        }
    });

    // Disabled Form Enter
    if ($("#" + ThisFormId).hasClass("disabled-enter") == true)
    {
        $("#" + ThisFormId).off('keypress').on('keypress', function (e)
        {
            if ((e.keyCode || e.which) == 13)
            {
                return false;
            }
        });
    }

    // Mandatory Asterisk
    $(".mandatory", _SelectedArea).each(function ()
    {
        $(".mandatory-asterisk", this).remove();
        $(this).append(' <span class="mandatory-asterisk" style="color: #FF0000;">*</span>');
    });

    // Password Eye
    $(".passwordeye").off("click", hideShowPassword).on("click", hideShowPassword);

    // Animated Label
    $(".az-label-animated").off("click", azLabelAnimatedClick).on("click", azLabelAnimatedClick);

    // Adjust Cards Height
    $('.az-accordion-card.adjust, .az-card.adjust, .az-list-card.adjust, .az-timeline-card.adjust').matchHeight();

    // Navbar Menu
    var _$NavbarMenu = $(".az-navbar-menu");
    var _NavbarTopHeight = _$NavbarMenu.parents(".az-navbar-top").height();
    _$NavbarMenu.off().on("click", "li > a", function (e)
    {
        var _$Anchor = $(this).attr('href');
        if (_$Anchor.indexOf("#") === 0)
        {
            e.preventDefault();
            if (_$NavbarMenu.parents(".az-navbar-top").hasClass("az-navbar-sticky") == false)
            {
                _NavbarTopHeight = 0;
            }
            if (_Options.navbarMenuAnimate)
            {
                $('html, body').stop().animate(
                {
                    scrollTop: $(_$Anchor).offset().top - _NavbarTopHeight
                }, 1500, 'easeInOutExpo');
            }
            else
            {
                $('html, body').animate(
                {
                    scrollTop: $(_$Anchor).offset().top - _NavbarTopHeight
                }, 0);
            }
            $(".az-navbar-top-content").removeClass("mobile");
        }
    });

    // Dropdown Menu
    if ($(".az-dropdown-button").is(":button"))
    {
        $(".az-dropdown-button").off("click", setDropdownClickEvent).on("click", setDropdownClickEvent);
    }
    $(".az-dropdown-button[href]").off("click", setDropdownClickEvent).on("click", setDropdownClickEvent);

    setAccordion(_Options.accordionIndex);
    setNavbarBranding(_Options.brandingHeight);
    setPortfolio();
    $(window).resize(function ()
    {
        setNavbarBranding(_Options.brandingHeight);
        setPortfolio();
        closeNavbarMobile();
    });
    consoleLog("formStyle");
    $.publish("validation/formStyle");
}

// Form Validation - Key Press
function validateValue(e)
{
    var _Element = e.target || e.srcElement;
    var _CurrentValidChar = getValidateType(e.data.ElementClass);
    var _KeyChar = e.keyCode || e.which;
    var _SelectedArea = e.data.SelectedArea;

    if (_KeyChar == 8 || _KeyChar == 13)
    {
        return true;
    }
    else
    {
        var c = String.fromCharCode(_KeyChar);
        var cl = c.toLowerCase();
        if (_CurrentValidChar.indexOf(cl) >= 0)
        {
            return true;
        }
        else
        {
            var _$InlineRoleAlert = $("[role='alert']", _SelectedArea);
            if (_$InlineRoleAlert.length > 0)
            {
                _$InlineRoleAlert.text(SingleDefaultElements.invalidCharacterText).removeClass('az-alert-info').addClass('az-alert-danger').show();
            }
            else
            {
                openStandardAlert(SingleDefaultElements.invalidCharacterTitle, SingleDefaultElements.invalidCharacterText);
            }
            $(_Element).focus();
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        }
    }
}

function serializeForm(SelectedArea)
{
    if (isEmpty(ObjJsonValidation) == false)
    {
        var _$Selector = {};
        var _CurrentDataType = "";
        var _OutputData = {};
        var _ElementError = false;

        if (SelectedArea != "" && SelectedArea != undefined && SelectedArea != null)
        {
            _SelectedArea = $(SelectedArea);
        }
        else
        {
            _SelectedArea = "";
        }

        $.each(ObjJsonValidation, function (HTMLElement, ObjJsonSubValidation)
        {
            if ($('#' + HTMLElement, _SelectedArea).length > 0)
            {
                _$Selector = {};
                _CurrentDataType = "";
                _$Selector = $('#' + HTMLElement, _SelectedArea);

                if (isEmpty(_$Selector) == false && isEmpty(ObjJsonSubValidation) == false)
                {
                    _CurrentDataType = ObjJsonSubValidation.datatype.toLowerCase();

                    if (_CurrentDataType != "")
                    {
                        // Output
                        if (_CurrentDataType == "int")
                        {
                            _OutputData[HTMLElement] = Number(_$Selector.val());
                        }
                        else if (_CurrentDataType == "date")
                        {
                            if (_$Selector.val().replace(/^\s+|\s+$/g, '') != "")
                            {
                                _OutputData[HTMLElement] = moment(_$Selector.datepicker("getDate")).format('MM/DD/YYYY');
                            }
                            else
                            {
                                _OutputData[HTMLElement] = null;
                            }
                        }
                        else
                        {
                            _OutputData[HTMLElement] = encodeURIComponent(_$Selector.val());
                        }
                        if (ObjJsonSubValidation.class.toLowerCase().indexOf("validate") != -1)
                        {
                            if (validateValue(_$Selector, _CurrentDataType, ObjJsonSubValidation) != 0)
                            {
                                if ($(".az-alert-active").length == 0)
                                {
                                    var _$InlineRoleAlert = $("[role='alert']", _SelectedArea);
                                    var _$DialogRoleAlert = window.parent.$(".ui-dialog-titlebar");
                                    if (_$InlineRoleAlert.length > 0)
                                    {
                                        _$InlineRoleAlert.text(SingleElements[HTMLElement + "SubmitError"]).removeClass('az-alert-info').addClass('az-alert-danger').show();
                                        _$Selector.focus();
                                        $("body").addClass("az-alert-active");
                                    }
                                    else if (_$DialogRoleAlert.length > 0)
                                    {
                                        _$DialogRoleAlert.hide();
                                        var _$NewTitleBar = $('<div class="ui-dialog-titlebar ui-widget-header"><p class="az-alert az-alert-danger" role="alert">' + SingleElements[HTMLElement + "SubmitError"] + '</p></div>');
                                        _$DialogRoleAlert.parents(".ui-dialog").prepend(_$NewTitleBar);
                                        _$Selector.focus();
                                        $("body").addClass("az-alert-active");
                                        window.setTimeout(function ()
                                        {
                                            _$NewTitleBar.remove();
                                            _$DialogRoleAlert.show();
                                            $("body").removeClass("az-alert-active");
                                        }, 3000);
                                    }
                                    else
                                    {
                                        $("body").addClass("az-alert-active");
                                        openStandardAlert(SingleDefaultElements.invalidCharacterTitle, SingleElements[HTMLElement + "SubmitError"], "", false);
                                    }
                                    consoleLog(HTMLElement);
                                }
                                _ElementError = true;
                                return false;
                            }
                        }
                    }
                }
            }
        });
        if (_ElementError == false)
        {
            return _OutputData;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }

    /////////////////////////////////

    function validateValue($Selector, CurrentDataType, ObjJsonSubValidation)
    {
        var _NoneValid = 0;
        var _CurrentLabel = ObjJsonSubValidation.label.toLowerCase();
        var _CurrentClass = ObjJsonSubValidation.class.match(/[\w-]*validate-[\w-]*/g)[0].toLowerCase();
        var _CurrentType = getCurrentType($Selector);

        if (_CurrentType == "input")
        {
            var _CurrentValue = $Selector.val().replace(/^\s+|\s+$/g, '');

            if (_CurrentLabel == "mandatory" && _CurrentValue == "")
            {
                _NoneValid += 1;
            }
            else if (_CurrentLabel == "mandatory" && _CurrentValue != "")
            {
                _NoneValid = validateValidValue($Selector, _CurrentClass, _CurrentValue, CurrentDataType, ObjJsonSubValidation);
            }
            else if (_CurrentLabel == "optional" && _CurrentValue != "")
            {
                _NoneValid = validateValidValue($Selector, _CurrentClass, _CurrentValue, CurrentDataType, ObjJsonSubValidation);
            }
        }
        else if (_CurrentType == "select" && _CurrentLabel == "mandatory")
        {
            if ($Selector.val() == "" || $Selector.val() == null || $Selector.val() == undefined || $Selector.val() == "0")
            {
                _NoneValid += 1;
            }
        }
        return _NoneValid;

        /////////////////////////////////

        function getCurrentType($Selector)
        {
            if ($Selector.is("[type='text'], [type='password'], [type='datetime'], [type='datetime-local'], [type='date'], [type='month'], [type='time'], [type='week'], [type='number'], [type='email'], [type='url'], [type='search'], [type='tel'], [type='color'], textarea"))
            {
                return "input";
            }
            else if ($Selector.is("select"))
            {
                return "select";
            }
        }

        function validateValidValue($Selector, CurrentClass, CurrentValue, CurrentDataType, ObjJsonSubValidation)
        {
            var _NoneValid = 0;
            if (CurrentDataType == "date" && isNaN(new Date(_$Selector.datepicker("getDate"))))
            {
                _NoneValid += 1;
            }
            else if (CurrentDataType == "datetime")
            {
                _NoneValid = 0;
            }
            else
            {
                var _CurrentValidChar = getValidateType(CurrentClass);
                for (var i = 0; i < CurrentValue.length; i++)
                {
                    if (_CurrentValidChar.indexOf(CurrentValue.charAt(i).toLowerCase()) == -1)
                    {
                        consoleLog(CurrentValue.charAt(i));
                        _NoneValid += 1;
                    }
                }
                if (CurrentClass == "validate-email" && isValidEmail(CurrentValue) == false)
                {
                    _NoneValid += 1;
                }
                if (CurrentClass == "validate-web" && isValidURL(CurrentValue) == false)
                {
                    _NoneValid += 1;
                }
                if (ObjJsonSubValidation.hasOwnProperty("maxlength") == true && CurrentValue.length > ObjJsonSubValidation.maxlength)
                {
                    _NoneValid += 1;
                }
                if (ObjJsonSubValidation.hasOwnProperty("minlength") == true && CurrentValue.length < ObjJsonSubValidation.minlength)
                {
                    _NoneValid += 1;
                }
            }
            return _NoneValid;
        }
    }
}

function isValidEmail(Email)
{
    var _RegExp = /^((([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+(\.([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+)*)@((((([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.))*([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.)[\w]{2,4}|(((([0-9]){1,3}\.){3}([0-9]){1,3}))|(\[((([0-9]){1,3}\.){3}([0-9]){1,3})\])))$/
    return _RegExp.test(Email);
}

function isValidURL(URL)
{
    var _RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
    return _RegExp.test(URL);
}

function populateForm(SelectedArea, SelectedObject)
{
    if (isEmpty(SelectedObject) == false && isEmpty(ObjJsonValidation) == false)
    {
        var _$Selector = {};
        var _DataAttr = "";
        if (SelectedArea != "" && SelectedArea != undefined && SelectedArea != null)
        {
            _SelectedArea = $(SelectedArea);
        }
        else
        {
            _SelectedArea = "";
        }

        $.each(SelectedObject, function (HTMLElement, Value)
        {
            _$Selector = {};
            _DataAttr = "";
            if ($('#' + HTMLElement, _SelectedArea).length > 0 && $('#' + HTMLElement, _SelectedArea).attr("data-attr") != undefined)
            {
                _$Selector = $('#' + HTMLElement, _SelectedArea);
            }
            else if ($('.' + HTMLElement, _SelectedArea).length > 0 && $('.' + HTMLElement, _SelectedArea).attr("data-attr") != undefined)
            {
                _$Selector = $('.' + HTMLElement, _SelectedArea);
            }

            if (isEmpty(_$Selector) == false)
            {
                _DataAttr = _$Selector.attr("data-attr");
                if (ObjJsonValidation[HTMLElement].datatype == "date")
                {
                    if (Value != "" && Value != null && Value != undefined)
                    {
                        _$Selector[_DataAttr](moment(Value).format('L'));
                    }
                }
                else if (ObjJsonValidation[HTMLElement].datatype == "datetime")
                {
                    if (Value != "" && Value != null && Value != undefined)
                    {
                        _$Selector[_DataAttr](moment(Value).format('L') + " - " + moment(Value).format('LT'));
                    }
                    else
                    {
                        _$Selector[_DataAttr](0);
                    }
                }
                else if (ObjJsonValidation[HTMLElement].datatype == "time")
                {
                    if (Value != "" && Value != null && Value != undefined)
                    {
                        _$Selector[_DataAttr](moment('01/01/1900 ' + Value).format('LT'));
                    }
                    else
                    {
                        _$Selector[_DataAttr](0);
                    }
                }
                else if (ObjJsonValidation[HTMLElement].datatype == "militarytime")
                {
                    if (Value != "" && Value != null && Value != undefined)
                    {
                        _$Selector[_DataAttr](moment('01/01/1900 ' + Value).format('HH:mm'));
                    }
                    else
                    {
                        _$Selector[_DataAttr](0);
                    }
                }
                else if (ObjJsonValidation[HTMLElement].datatype == "decimal")
                {
                    if (Value != "" && Value != null && Value != undefined)
                    {
                        _$Selector[_DataAttr](numeral(Value).format('0.00'));
                    }
                }
                else
                {
                    if (Value != "" && Value != null && Value != undefined)
                    {
                        _$Selector[_DataAttr](Value);
                    }
                    else if (Value == null)
                    {
                        _$Selector[_DataAttr](0);
                    }
                }
            }
        });
    }
}

function lockForm(SelectedForm)
{
    $("#" + SelectedForm + " :input").each(function ()
    {
        $(this).prop("disabled", true);
    });
}

function unlockForm(forSelectedFormmName, resetForm)
{
    $("#" + SelectedForm + " :input").each(function ()
    {
        $(this).prop("disabled", false);
        if (resetForm == true)
        {
            $(this).val("");
            if ($(this).is("[type='checkbox']"))
            {
                $(this).attr("checked", false)
            }
            if ($(this).is("[type='radio']"))
            {
                $(this).attr("checked", false)
            }
        }
    });
}
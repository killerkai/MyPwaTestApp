
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
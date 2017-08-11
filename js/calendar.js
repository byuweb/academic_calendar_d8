window.onload = function () {
    var isClicked;
    var followLink;
    var metaTag = document.createElement('meta');
    metaTag.name = "viewport";
    metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName('head')[ 0 ].appendChild(metaTag);
    var ttDiv = document.createElement('div');
    ttDiv.className = "accal-tooltip";
    document.body.appendChild(ttDiv);
    var tooltip = document.querySelectorAll(".accal-tooltip")[ 0 ];
    var showtip = false;
    var tableCells = document.querySelectorAll(".table-cell-contents div");
    for (var i = 0; i < tableCells.length; i++) {
        tableCells[ i ].addEventListener('mouseenter', function (e) {
            showCalendarTooltip(e, "mouse");
        });
        tableCells[ i ].addEventListener('mousemove', function (e) {
            moveCalendarTooltip(e, "mouse");
        });
        tableCells[ i ].addEventListener('mouseleave', function (e) {
            hideCalendarTooltip(e, "mouse");
        });
        tableCells[ i ].addEventListener('touchstart', function (e) {
            e.preventDefault();
            showCalendarTooltip(e, "touch");
        });
        tableCells[ i ].addEventListener('touchmove', function (e) {
            e.preventDefault();
            moveCalendarTooltip(e, "touch");
        });
        tableCells[ i ].addEventListener('touchend', function (e) {
            e.preventDefault();
            hideCalendarTooltip(e, "touch");
        });
        tableCells[ i ].addEventListener('touchcancel', function (e) {
            e.preventDefault();
            hideCalendarTooltip(e, "touch");
        });
    }

    function showCalendarTooltip(e, type) {
        var title = e.currentTarget.dataset.title;
        var text = e.currentTarget.dataset.text;
        tooltip.innerHTML = "<h3>" + title + "</h3><span>" + text + "</span>";
        var div = document.createElement('div');
        div.innerHTML = e.currentTarget.innerHTML;
        followLink = (div.querySelector("a") != null) ? div.querySelector("a").href : false;
        if (type == "mouse") {
            showtip = true;
            followLink = false;
            var mousePos = getCalendarTipPos(e, type);
            showCalendarTip(mousePos.x, mousePos.y);
        } else {
            isClicked = setTimeout(function () {
                showtip = true;
                followLink = false;
                var mousePos = getCalendarTipPos(e, type);
                showCalendarTip(mousePos.x, mousePos.y);
            }, 150);
        }
    }

    function moveCalendarTooltip(e, type) {
        var mousePos = getCalendarTipPos(e, type);
        showCalendarTip(mousePos.x, mousePos.y);
    }

    function hideCalendarTooltip(e, type) {
        tooltip.style.display = "none";
        showtip = false;
        clearTimeout(isClicked);
        if (followLink !== false) {
            window.open(followLink, "_self");
        }
    }

    function showCalendarTip(x, y) {
        if (showtip) {
            tooltip.style.top = y + "px";
            tooltip.style.left = x + "px";
            tooltip.style.display = "block";
        }
    }

    function getCalendarTipPos(e, type) {
        var tipPos = { x: -1000, y: -1000 };
        if (type == "mouse") {
            eClientX = e.clientX;
            eClientY = e.clientY;
            ePageX = e.pageX;
            ePageY = e.pageY;
            xPer = 100 * (eClientX / window.innerWidth);
            if (xPer <= 25) {
                xOff = 20;
            } else if (xPer <= 75) {
                xOff = -125;
            } else {
                xOff = -270;
            }
            yPer = 100 * (eClientY / window.innerHeight);
            if (yPer <= 50) {
                yOff = 40;
            } else {
                yOff = -115;
            }
        } else {
            eClientX = e.touches[ 0 ].clientX;
            eClientY = e.touches[ 0 ].clientY;
            ePageX = e.touches[ 0 ].pageX;
            ePageY = e.touches[ 0 ].pageY;
            xPer = 100 * (eClientX / window.innerWidth);
            if (xPer <= 25) {
                xOff = 20;
            } else if (xPer <= 75) {
                xOff = -125;
            } else {
                xOff = -270;
            }
            yPer = 100 * (eClientY / window.innerHeight);
            if (yPer <= 20) {
                yOff = 40;
            } else {
                yOff = -115;
            }
        }
        tipPos.x = Math.round(ePageX + xOff);
        tipPos.y = Math.round(ePageY + yOff);
        return tipPos;
    }

    window.onresize = windowResize;

    function windowResize() {
        var accal = document.getElementById("byu-academic-calendar");
        var accalWide = accal.offsetWidth;
        var sizeClass = "";
        if (accalWide >= 1100) {
            sizeClass = " calendar-size-1";
        } else if (accalWide >= 857) {
            sizeClass = " calendar-size-2";
        } else if (accalWide >= 570) {
            sizeClass = " calendar-size-3";
        } else {
            sizeClass = " calendar-size-4";
        }
        accal.className = "calendar-content" + sizeClass;
        console.log(accalWide, accal.className);
    }

    windowResize();
}
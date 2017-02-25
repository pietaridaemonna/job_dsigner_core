var logPath, logPath2;
var LOG_STR = "";
var LOG = document.getElementById('jsInspector');
var $points = document.getElementById('points');

var POINT_ID_MAP = [];


function log(msg) {
    var msgDiv = document.createElement('div');
    msgDiv.appendChild(document.createTextNode(msg));
    $logger.appendChild(msgDiv);
}

var DrawingObjects = (function () {
    var allPaths = [];
    var $canvasEl = document.getElementById('drawing');
    $canvasEl.width = $points.offsetWidth - 4;
    $canvasEl.height = $points.offsetHeight - 4;
    $canvasEl.style.width = $points.offsetWidth - 4 + 'px';
    $canvasEl.style.height = $points.offsetHeight - 4 + 'px';
    var ctx = $canvasEl.getContext('2d');

    var PathObject = function (segments, closed) {
        this._segments = segments;
        this._pointsSetup = false;
        this._pointsMap = [];
        this._pointsMap.toJSON = function () {
            var rArr = [],
                rObj;
            for (var i = 0; i < this.length; i++) {
                rObj = {};
                rObj._in = this[i][0].id;
                rObj._out = this[i][1].id;
                rObj._pt = this[i][2].id;
                rArr.push(rObj);
            }
            return rArr;
        };
        allPaths.push(this);
    };

    PathObject.prototype._setupPoint = function (obj, append) {
        var point = document.createElement('div'),
            pointLegend = document.createElement('div');
        if (obj) {
            point.className = "canvas-point";
            pointLegend.className = "canvas-point-legend";
            point.id = obj._id;
            pointLegend.id = "legend_" + obj._id;
        }
        if (append !== true) {
            $points.appendChild(point);
            $points.appendChild(pointLegend);
        }
        return [point, pointLegend];
    };
    PathObject.prototype._setupPoints = function () {
        var i, handleIn, handleOut, point;
        for (i = 0; i < this._segments.length; i++) {
            handleIn = this._setupPoint(this._segments[i]._handleIn);
            handleOut = this._setupPoint(this._segments[i]._handleOut, (i === this._segments.length - 1));
            point = this._setupPoint(this._segments[i]._point);
            this._pointsMap.push([handleOut, handleIn, point]);
        }
        this._pointsSetup = true;
    };
    PathObject.prototype._positionPoint = function (pointDOM, pointCTX) {
        var padY = 4,
            padX = -40;
        pointDOM[0].style.left = pointCTX._x + 'px';
        pointDOM[0].style.top = pointCTX._y + 'px';
        pointDOM[1].style.left = pointCTX._x + padX + 'px';
        pointDOM[1].style.top = pointCTX._y + padY + 'px';
        pointDOM[1].innerHTML = "#" + pointCTX._id + " @ " + pointCTX._x + " , " + pointCTX._y;
    };
    PathObject.prototype._positionPoints = function () {
        var i;
        for (i = 0; i < this._segments.length; i++) {
            this._positionPoint(this._pointsMap[i][2], this._segments[i]._point);
            if (this._segments[i]._handleIn) {
                this._positionPoint(this._pointsMap[i][1], this._segments[i]._handleIn);
            }
            if (this._segments[i]._handleOut && i !== this._segments.length - 1) {
                this._positionPoint(this._pointsMap[i][0], this._segments[i]._handleOut);
            }
        }
    };
    PathObject.prototype.drawPoints = function (ctx) {
        if (this._pointsSetup !== true) {
            this._setupPoints();
        }
        this._positionPoints();
    };
    PathObject.prototype.drawPath = function (ctx) {
        var i, currSegment, prevHandleOut;
        ctx.save();
        ctx.strokeStyle = "rgba(10,10,10,0.9)";
        ctx.lineWidth = 2;

        LOG_STR += "ctx.beginPath();\n";
        ctx.beginPath();

        for (i = 0; i < this._segments.length; i++) {
            currSegment = this._segments[i];
            if (currSegment._first) {
                ctx.moveTo(currSegment._point._x, currSegment._point._y);
                LOG_STR += "ctx.moveTo(" + currSegment._point._x + ", " + currSegment._point._y + ");\n";
            } else {
                ctx.bezierCurveTo(prevHandleOut._x, prevHandleOut._y,
                currSegment._handleIn._x, currSegment._handleIn._y,
                currSegment._point._x, currSegment._point._y);
                LOG_STR += "ctx.bezierCurveTo(" + prevHandleOut._x + ", " + prevHandleOut._y + ", " + currSegment._handleIn._x + ", " + currSegment._handleIn._y + ", " + currSegment._point._x + ", " + currSegment._point._y + ");\n"
            }
            prevHandleOut = currSegment._handleOut;
        }
        ctx.stroke();
        ctx.closePath();
        LOG_STR += "ctx.stroke();\n";
        LOG_STR += "ctx.closePath();\n\n\n";
        LOG.innerHTML = LOG_STR;
        ctx.restore();
    };
    PathObject.prototype.drawHandles = function (ctx) {
        var i, currSegment, prevHandleOut;
        ctx.save();
        ctx.strokeStyle = "rgba(60,60,60,0.7)";
        ctx.lineWidth = 0.7;

        for (i = 0; i < this._segments.length; i++) {
            ctx.beginPath();
            currSegment = this._segments[i];
            if (currSegment._first) {
                ctx.moveTo(currSegment._point._x, currSegment._point._y);
                ctx.lineTo(currSegment._handleOut._x, currSegment._handleOut._y);
            } else {
                ctx.moveTo(currSegment._point._x, currSegment._point._y);
                ctx.lineTo(currSegment._handleIn._x, currSegment._handleIn._y);
                if (i !== this._segments.length - 1) {
                    ctx.moveTo(currSegment._point._x, currSegment._point._y);
                    ctx.lineTo(currSegment._handleOut._x, currSegment._handleOut._y);
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    };

    return {
        Point: function (x, y) {
            this._x = x;
            this._y = y;
            this._id = POINT_ID_MAP.length;
            POINT_ID_MAP.push(this);
        },
        Segment: function (handleIn, handleOut, point, first) {
            this._handleIn = handleIn;
            this._handleOut = handleOut;
            this._point = point;
            this._first = first;
        },
        Path: PathObject,
        Util: {
            createPoint: function () {
                return (new DrawingObjects.Point(arguments[0][0], arguments[0][1]));
            },
            createPath: function () {
                var i, segments = [],
                    currArg, cPt = DrawingObjects.Util.createPoint;
                for (i = 0; i < arguments.length; i++) {
                    currArg = arguments[i];
                    if (i === 0) {
                        segments.push(new DrawingObjects.Segment(null, cPt(currArg[0]), cPt(currArg[1]), true));
                    } else {
                        segments.push(new DrawingObjects.Segment(cPt(currArg[0]), cPt(currArg[1]), cPt(currArg[2]), false));
                    }
                }
                return (new DrawingObjects.Path(segments, false));
            },
            drawAllPaths: function (handles, points) {
                var i;
                LOG_STR = "";
                for (i = 0; i < allPaths.length; i++) {
                    allPaths[i].drawPath(ctx);
                    handles && allPaths[i].drawHandles(ctx);
                    points && allPaths[i].drawPoints(ctx);
                }
            },
            clearContext: function () {
                ctx.clearRect(0, 0, $canvasEl.width, $canvasEl.height);
            }
        }
    };
}());

(function mouseHandler() {
    'use strict';
    var mouseMoveE = null,
        mouseUpE = null,
        activeTarget = null,
        activeTargetLegend = null,
        activeId = null,
        origX, origY, origXL, origYL, origXP, origYP;
    var mDownEv = ('ontouchstart' in window ? 'touchstart' : 'mousedown');
    var mMoveEv = ('ontouchstart' in window ? 'touchmove' : 'mousemove');
    var mUpEv = ('ontouchstart' in window ? 'touchend' : 'mouseup');


    function handleMDown(ev) {
        if (ev.targetTouches && ev.targetTouches.length > 1) {
            return;
        }
        ev.preventDefault();
        var Dtarget = ev.target;
        var ex = ev.targetTouches && ev.targetTouches[0] ? ev.targetTouches[0].pageX : ev.x;
        var ey = ev.targetTouches && ev.targetTouches[0] ? ev.targetTouches[0].pageY : ev.y;
        if (Dtarget !== $points) {
            activeTarget = Dtarget;
            if (activeTarget.id.indexOf('legend') !== -1) {
                activeTargetLegend = activeTarget;
                activeId = activeTargetLegend.id.replace('legend_', '');
                activeTarget = document.getElementById(activeId);
            } else {
                activeId = activeTarget.id;
                activeTargetLegend = document.getElementById("legend_" + activeTarget.id);
            }
            origX = parseInt(activeTarget.style.left) - ex;
            origY = parseInt(activeTarget.style.top) - ey;
            origXL = parseInt(activeTargetLegend.style.left) - ex;
            origYL = parseInt(activeTargetLegend.style.top) - ey;
            origXP = POINT_ID_MAP[activeId]._x - ex;
            origYP = POINT_ID_MAP[activeId]._y - ey;
            mouseMoveE = $points.addEventListener(mMoveEv, handleMMove);
            mouseUpE = $points.addEventListener(mUpEv, handleMUp);
        } else {
            var found = ev.target.className.indexOf('hide');
            DrawingObjects.Util.clearContext();
            if (found !== -1) {
                ev.target.className = ev.target.className.replace(' hide', '');
                DrawingObjects.Util.drawAllPaths(true, false);
            } else {
                ev.target.className += ' hide';
                DrawingObjects.Util.drawAllPaths(false, false);
            }

        }
    }

    function handleMMove(ev) {
        if (ev.targetTouches && ev.targetTouches.length > 1) {
            return;
        }
        ev.preventDefault();
        var ex = ev.targetTouches && ev.targetTouches[0] ? ev.targetTouches[0].pageX : ev.x;
        var ey = ev.targetTouches && ev.targetTouches[0] ? ev.targetTouches[0].pageY : ev.y;
        activeTarget.style.left = origX + (ex) + 'px';
        activeTarget.style.top = origY + (ey) + 'px';
        activeTargetLegend.style.left = origXL + (ex) + 'px';
        activeTargetLegend.style.top = origYL + (ey) + 'px';
        DrawingObjects.Util.clearContext();

        mapIDtoLogPoint(activeId, origXP + ex, origYP + ey);

        POINT_ID_MAP[activeId]._x = origXP + ex;
        POINT_ID_MAP[activeId]._y = origYP + ey;
        activeTargetLegend.innerHTML = "#" + activeId + " @ " + POINT_ID_MAP[activeId]._x + " , " + POINT_ID_MAP[activeId]._y;
        DrawingObjects.Util.drawAllPaths(true, false);
    }

    function handleMUp(ev) {
        $points.removeEventListener(mMoveEv, handleMMove);
        $points.removeEventListener(mUpEv, handleMUp);
    }

    $points.addEventListener(mDownEv, handleMDown);
}());


var path = DrawingObjects.Util.createPath([
    [70, 20],
    [100, 100]
], [
    [230, 20],
    [340, 120],
    [280, 50]
], [
    [260, 180],
    [340, 150],
    [200, 150]
]);

var path2 = DrawingObjects.Util.createPath([
    [110, 250],
    [100, 340]
], [
    [205, 210],
    [360, 300],
    [260, 250]
], [
    [250, 480],
    [190, 310],
    [200, 400]
], [
    [480, 440],
    [370, 400],
    [380, 340]
]);

DrawingObjects.Util.drawAllPaths(true, true);

var logCV = new fabric.Canvas('fabric');
logCV.setDimensions({
    width: document.getElementById('fabricLog').offsetWidth,
    height: document.getElementById('fabricLog').offsetHeight
});
logCV.height = document.getElementById('fabricLog').offsetHeight;
logCV.width = document.getElementById('fabricLog').offsetWidth;
logPath = new fabric.Path('M100,100C70,20,230,20,280,50C340,120,260,180,200,150');
logPath.fill = false;
logPath.stroke = "rgba(10,10,10,1);";
logPath.strokeWidth = 2;
logPath.top = 30;
logPath.left = 35;
logPath.scaleX = logPath.scaleY = 0.5;
logCV.add(logPath);
logPath2 = new fabric.Path('M100,340C110,250,205,210,260,250C360,300,250,480,200,400C190,310,480,440,380,340');
logPath2.fill = false;
logPath2.stroke = "rgba(10,10,10,1);";
logPath2.strokeWidth = 2;
logPath2.top = 130;
logPath2.left = 35;
logPath2.scaleX = logPath2.scaleY = 0.5;
logCV.add(logPath2);

//-----------------

var canvas = document.getElementById('paper');
var ss = paper.setup(canvas);
ss.project._view.setViewSize({
    width: document.getElementById('fabricLog').offsetWidth,
    height: document.getElementById('fabricLog').offsetHeight
});

var Ppath = new paper.Path('M100,100C70,20,230,20,280,50C340,120,260,180,200,150');
Ppath.strokeColor = 'black';

var Ppath2 = new paper.Path('M100,340C110,250,205,210,260,250C360,300,250,480,200,400C190,310,480,440,380,340');
Ppath2.strokeColor = 'black';

ss.project.layers[0]._matrix.scale(0.5);

paper.view.draw();

//----------------------


function mapIDtoLogPoint(id, x, y) {
    var p1Len = 2 + ((logPath.complexity() - 1) * 3);
    var p2Len = 2 + ((logPath2.complexity() - 1) * 3);
    var changePath = logPath,
        changePpath = Ppath,
        searchPath = path;
    if (id == 1 || id == p1Len + 1) {
        if (id == p1Len + 1) {
            changePath = logPath2;
            changePpath = Ppath2;
        }
        changePath.path[0][1] = x;
        changePath.path[0][2] = y;
        changePpath._segments[0]['_point']._x = x / 2;
        changePpath._segments[0]['_point']._y = y / 2;
    } else {
        if (id >= p1Len) {
            changePath = logPath2;
            changePpath = Ppath2;
            searchPath = path2;
        }
        var i, j, seg, found, fStr;
        for (i = 0; i < searchPath._segments.length; i++) {
            seg = searchPath._segments[i];
            if (seg._handleIn && seg._handleIn._id == id) {
                found = [i, 3];
                fStr = '_handleIn';
                break;
            }
            if (seg._handleOut && seg._handleOut._id == id) {
                found = [i + 1, 1];
                fStr = '_handleOut';
                break;
            }
            if (seg._point._id == id) {
                found = [i, 5];
                fStr = '_point';
                break;
            }
        }
        changePath.path[found[0]][found[1]] = x;
        changePath.path[found[0]][found[1] + 1] = y;
        if (fStr === '_handleOut') {
            found[0]--;
        }
        if (fStr !== '_point') {
            x = x - (changePath.path[found[0]][5] || changePath.path[found[0]][1]);
            y = y - (changePath.path[found[0]][6] || changePath.path[found[0]][2]);
        }
        changePpath._segments[found[0]][fStr]._x = x / 2;
        changePpath._segments[found[0]][fStr]._y = y / 2;
    }
    logCV.renderAll();
    paper.project._needsUpdate = true;
    paper.view.draw();
}










/*
HTML

<div id="fabricLog">
    <canvas id="fabric"></canvas>
</div>
<div id="paperLog">
    <canvas id="paper"></canvas>
</div>
<canvas id="drawing"></canvas>
<div id="points">
    <div id="jsInspector"></div>
</div>*/





// CSS

// @import url(http://fonts.googleapis.com/css?family=Istok+Web:400, 700);
//  div {
//     -moz-user-select: none;
//     -khtml-user-select: none;
//     -webkit-user-select: none;
//     -o-user-select: none;
//     cursor: pointer;
//     font-family:'Istok Web', sans-serif;
// }
// #logger {
//     position:absolute;
//     width: 30%;
//     height: 100%;
//     right: 0px;
//     top: 0px;
//     bottom: 0px;
//     border: 1px solid #333;
//     font-size: 10px;
//     background: #666;
//     color: #ddd;
//     text-shadow: -1px 1px 1px rgba(0, 0, 0, 0.5);
//     overflow-y: scroll;
//     overflow-x: hidden;
// }
// #logger div {
//     margin: 6px;
//     border-bottom: 1px solid #ccc;
// }
// #drawing, #points {
//     margin: 10px;
//     border: 2px solid #222;
//     position: absolute;
//     top: 0px;
//     left: 0px;
//     right: 30%;
//     bottom: 0px;
// }
// #points div {
//     z-index: 100;
//     position: absolute;
//     cursor: move;
// }
// #points .canvas-point {
//     height: 8px;
//     width: 8px;
//     background: #99e;
//     margin: -6px;
//     border: 1px solid #777;
//     box-shadow: inset 2px 2px 4px rgba(240, 240, 240, 0.8);
//     border-radius: 4px;
// }
// #points .canvas-point-legend {
//     width: 60px;
//     height: 1em;
//     background: #ddd;
//     color: #333;
//     border: 2px solid #ddd;
//     opacity: 0.75;
//     font-size: 8px;
//     padding: 2px;
//     text-align: center;
//     font-weight: bolder;
//     box-shadow: -3px 3px 9px rgba(40, 40, 40, 0.333);
//     opacity: 0.5;
// }
// #points .canvas-point-legend:hover {
//     font-size: 12px;
//     width: 100px;
//     margin: 0px -20px;
//     padding: 5px;
//     z-index: 1000;
//     font-weight: bold;
//     opacity: 0.8;
// }
// #points.hide {
//     opacity: 0;
// }
// #fabricLog {
//     position:absolute;
//     width: 30%;
//     right: 5px;
//     top: 10px;
//     bottom: 50%;
//     border: 1px solid #333;
// }
// #paperLog {
//     position:absolute;
//     width: 30%;
//     right: 5px;
//     bottom: 10px;
//     top: 50%;
//     border: 1px solid #333;
// }
// #points::after, #paperLog::after, #fabricLog::after, #points::before {
//     position: absolute;
//     bottom: 2em;
//     left: 10%;
//     z-index: 2000;
// }
// #points::after, #paperLog::after, #fabricLog::after {
//     border: 1px solid #ddd;
//     border-radius: 6px;
//     box-shadow: -2px 2px 4px rgba(155, 155, 155, 0.1);
//     padding: 10px;
//     background: #fafafa;
// }
// #jsInspector {
//     position: absolute;
//     width: 70%;
//     left: 10%;
//     bottom: 8em;
//     height: 20em;
//     border: 2px solid #ccc;
//     border-radius: 5px;
//     background: #fefefe;
//     padding: 10px;
//     box-shadow: inset 24px 24px 72px rgba(180, 180, 180, 0.333);
//     font-family: monospace;
//     white-space: pre;
//     font-size: 11px;
// }
// #paperLog::after {
//     content:"PaperJS Mirror of data";
// }
// #fabricLog::after {
//     content:"FabricJS Mirror of data";
// }
// #points::after {
//     content:"Pure JavaScript Implementation";
// }
// #jsInspector::before {
//     display: block;
//     content:"JavaScript Insepctor";
//     text-shadow: -2px 2px 4px rgba(80, 80, 80, 0.5);
//     color: #777;
//     font-size: 14px;
//     border-bottom: 1px solid #777;
// }
// #points::before {
//     content:"Move the points above for mirrored updates to the right in FabricJS or PaperJS.";
//     font-size: 10px;
//     margin-left: 12px;
//     bottom: 1.5em;
//     opacity: 0.5;
// }
// @media only screen and (max-device-width: 480px) {
//     #points .canvas-point-legend {
//         font-size: 16px;
//         width: 150px;
//         border: 10px solid #ccc;
//         border-radius: 10px;
//         margin: 4px;
//         padding: 4px;
//         box-shadow: -8px 8px 24px rgba(40, 40, 40, 0.333);
//         opacity: 0.333;
//     }
//     #points .canvas-point-legend:hover {
//         font-size: 24px;
//         width: 240px;
//         opacity: 0.666;
//     }
//     #jsInspector {
//         font-size: 18px;
//         width: 80%;
//     }
// }
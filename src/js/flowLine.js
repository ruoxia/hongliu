export default class flowLine {
    constructor(viewer, opts) {
        this.viewer = viewer
        this.opts = opts
        this.dataSources = new Cesium.CustomDataSource(Cesium.createGuid())
        viewer.dataSources.add(this.dataSources)
        this.trplist = []
        this.addPoints()
    }

    addPoints() {
        var arr = [
            {
                label: '王坡监控中心',
                position: [112.72894228423641, 35.67461553849026, 130],
                materialcolor: Cesium.Color.ORANGE,
                labelcolor: [
                    Cesium.Color.fromCssColorString('#ffff00'),
                    Cesium.Color.fromCssColorString('#ffffff'),
                    Cesium.Color.fromCssColorString('#dca577').withAlpha(0.2)
                ],
                tetrahedronColor: [Cesium.Color.YELLOW.withAlpha(0.8), Cesium.Color.RED.withAlpha(0.8)]
            },
            {
                label: '塔里风井',
                position: [112.6702528, 35.6867359, 32.38],
                materialcolor: Cesium.Color.fromCssColorString('#03A9F4'),
                labelcolor: [
                    Cesium.Color.fromCssColorString('#ffffff'),
                    Cesium.Color.fromCssColorString('#8bc8e4'),
                    Cesium.Color.fromCssColorString('#03A9F4').withAlpha(0.3)
                ],
                tetrahedronColor: [
                    Cesium.Color.fromCssColorString('#03A9F4').withAlpha(0.8),
                    Cesium.Color.RED.withAlpha(0.8)]
            },
            {
                label: '上寺头风井',
                position: [112.7011155, 35.6755327, 30.6],
                materialcolor: Cesium.Color.fromCssColorString('#03A9F4'),
                labelcolor: [
                    Cesium.Color.fromCssColorString('#ffffff'),
                    Cesium.Color.fromCssColorString('#8bc8e4'),
                    Cesium.Color.fromCssColorString('#03A9F4').withAlpha(0.3)
                ],
                tetrahedronColor: [Cesium.Color.fromCssColorString('#03A9F4').withAlpha(0.8),
                Cesium.Color.RED.withAlpha(0.8)]
            }
        ]
        for (var i = 0; i < arr.length; i++) {
            var xyz = arr[i].position
            var entity1 = this.dataSources.entities.add({
                position: Cesium.Cartesian3.fromDegrees(xyz[0], xyz[1], xyz[2]),
                ellipse: {
                    semiMinorAxis: 200.0,
                    semiMajorAxis: 200.0,
                    material: new Cesium.EllipsoidFadeMaterialProperty(arr[i].materialcolor, 2000)
                },
                label: {
                    text: arr[i].label,
                    font: '14pt Source Han Sans CN', // 字体样式
                    fillColor: arr[i].labelcolor[0], // 字体颜色
                    outlineColor: arr[i].labelcolor[1],
                    outlineWidth: 3,
                    backgroundColor: arr[i].labelcolor[2], // 背景颜色
                    showBackground: true, // 是否显示背景颜色
                    style: Cesium.LabelStyle.FILL, // label样式
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 水平位置
                    pixelOffset: new Cesium.Cartesian2(15, -40), // 偏移
                    eyeOffset: new Cesium.Cartesian3(0, 0, -10)
                }
            })
            // 加入场景
            var tetrahedronPrimitive = new TetrahedronPrimitive({
                viewer: viewer,
                position: Cesium.Cartesian3.fromDegrees(xyz[0], xyz[1], xyz[2] + 1),
                fenceimg: 'images/fence.png',
                scale: new Cesium.Cartesian3(30, 30, 45),
                color: arr[i].tetrahedronColor[0],
                color2: arr[i].tetrahedronColor[1]
            })
            this.dataSources._primitives.add(tetrahedronPrimitive)
            // 开启动画
            tetrahedronPrimitive.startAnimate()
            this.trplist.push(tetrahedronPrimitive)
            // 关闭动画
            // this.tetrahedronPrimitive.closeAnimate();
        }

        const mm = this.parabola([arr[0].position[0], arr[0].position[1], arr[0].position[2], arr[1].position[0], arr[1].position[1], arr[1].position[2]])

        const mm2 = this.parabola([arr[0].position[0], arr[0].position[1], arr[0].position[2], arr[2].position[0], arr[2].position[1], arr[2].position[2]])

        // 添加至场景
        this.flylineentity = viewer.scene.primitives.add(
            new Cesium.Primitive({
                geometryInstances: [new Cesium.GeometryInstance({
                    geometry: new Cesium.PolylineGeometry({
                        positions: mm,
                        width: 4
                    }),
                    id: 'flyline'
                }), new Cesium.GeometryInstance({
                    geometry: new Cesium.PolylineGeometry({
                        positions: mm2,
                        width: 4
                    }),
                    id: 'flyline2'
                })],
                appearance: this.getFlylineMaterial(),
                releaseGeometryInstances: false,
                compressVertices: false
            })
        )
    }

    parabola(twoPoints) {
        // 抛物线绘制
        let s = []
        const startPoint = [twoPoints[0], twoPoints[1], twoPoints[2]] // 起点的经度、纬度
        s = s.concat(startPoint)
        const step = 80 // 线的多少，越多则越平滑(但过多浏览器缓存也会占用越多)
        const heightProportion = 0.25 // 最高点和总距离的比值
        const dLon = (twoPoints[3] - startPoint[0]) / step // 经度差值
        const dLat = (twoPoints[4] - startPoint[1]) / step // 纬度差值
        const deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1])) // 经度差(米级)
        const deltaLat = dLat * 111000 // 纬度差(米),1纬度相差约111000米
        const endPoint = [0, 0, 0] // 定义一个端点（后面将进行startPoint和endPoint两点画线）
        const heigh = (step * Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) * heightProportion).toFixed(0) * 2 + twoPoints[2]
        const x2 = 10000 * Math.sqrt(dLon * dLon + dLat * dLat) // 小数点扩大10000倍，提高精确度
        const a = heigh / (x2 * x2)
        function y(x, height) {
            return height - a * x * x + twoPoints[2]
        }
        for (var i = 1; i <= step; i++) {
            // 逐“帧”画线
            endPoint[0] = startPoint[0] + dLon // 更新end点经度
            endPoint[1] = startPoint[1] + dLat // 更新end点纬度
            const x = x2 * ((2 * i) / step - 1) // 求抛物线函数x
            endPoint[2] = y(x, heigh).toFixed(0) * 1 // 求end点高度
            s = s.concat(endPoint)

            // end点变为start点
            startPoint[0] = endPoint[0]
            startPoint[1] = endPoint[1]
            startPoint[2] = endPoint[2]
        }
        s[s.length - 1] = twoPoints[5]
        return Cesium.Cartesian3.fromDegreesArrayHeights(s)
    }

    getFlylineMaterial() {
        // 创建材质，在MaterialAppearance中若不添加基础材质，模型将会透明
        var material = new Cesium.Material.fromType('Color')
        material.uniforms.color = Cesium.Color.ORANGE
        // 飞线效果-飞线间隔，宽度2
        const fragmentShaderSource = `         
                varying vec2 v_st;    
                varying float v_width;    
                varying float v_polylineAngle;
                varying vec4 v_positionEC;
                varying vec3 v_normalEC;
                void main()
                {
                    vec2 st = v_st;
                    // 箭头飞线，宽度 8
                    float xx = fract(st.s*20.0 + st.t  - czm_frameNumber/15.0);
                    if (st.t<0.5) {
                        xx = fract(st.s*20.0 - st.t - czm_frameNumber/15.0);
                    }
                    float r = 1.0;
                    float g = xx;
                    float b = xx;
                    float a = xx;

                    // 飞线边框
                    if (st.t>0.8||st.t<0.2) {
                        g = 1.0;
                        b = 1.0;
                        a = 0.4;
                    }

                    gl_FragColor = vec4(r,g,b,a);
                }

        `
        // 自定义材质
        const aper = new Cesium.PolylineMaterialAppearance({
            material: material,
            translucent: true,
            vertexShaderSource: `
                #define CLIP_POLYLINE 
                void clipLineSegmentToNearPlane(
                    vec3 p0,
                    vec3 p1,
                    out vec4 positionWC,
                    out bool clipped,
                    out bool culledByNearPlane,
                    out vec4 clippedPositionEC)
                {
                    culledByNearPlane = false;
                    clipped = false;
                    vec3 p0ToP1 = p1 - p0;
                    float magnitude = length(p0ToP1);
                    vec3 direction = normalize(p0ToP1);
                    float endPoint0Distance =  czm_currentFrustum.x + p0.z;
                    float denominator = -direction.z;
                    if (endPoint0Distance > 0.0 && abs(denominator) < czm_epsilon7)
                    {
                        culledByNearPlane = true;
                    }
                    else if (endPoint0Distance > 0.0)
                    {
                        float t = endPoint0Distance / denominator;
                        if (t < 0.0 || t > magnitude)
                        {
                            culledByNearPlane = true;
                        }
                        else
                        {
                            p0 = p0 + t * direction;
                            p0.z = min(p0.z, -czm_currentFrustum.x);
                            clipped = true;
                        }
                    }
                    clippedPositionEC = vec4(p0, 1.0);
                    positionWC = czm_eyeToWindowCoordinates(clippedPositionEC);
                }
                vec4 getPolylineWindowCoordinatesEC(vec4 positionEC, vec4 prevEC, vec4 nextEC, float expandDirection, float width, bool usePrevious, out float angle)
                {
                    #ifdef POLYLINE_DASH
                    vec4 positionWindow = czm_eyeToWindowCoordinates(positionEC);
                    vec4 previousWindow = czm_eyeToWindowCoordinates(prevEC);
                    vec4 nextWindow = czm_eyeToWindowCoordinates(nextEC);
                    vec2 lineDir;
                    if (usePrevious) {
                        lineDir = normalize(positionWindow.xy - previousWindow.xy);
                    }
                    else {
                        lineDir = normalize(nextWindow.xy - positionWindow.xy);
                    }
                    angle = atan(lineDir.x, lineDir.y) - 1.570796327;
                    angle = floor(angle / czm_piOverFour + 0.5) * czm_piOverFour;
                    #endif
                    vec4 clippedPrevWC, clippedPrevEC;
                    bool prevSegmentClipped, prevSegmentCulled;
                    clipLineSegmentToNearPlane(prevEC.xyz, positionEC.xyz, clippedPrevWC, prevSegmentClipped, prevSegmentCulled, clippedPrevEC);
                    vec4 clippedNextWC, clippedNextEC;
                    bool nextSegmentClipped, nextSegmentCulled;
                    clipLineSegmentToNearPlane(nextEC.xyz, positionEC.xyz, clippedNextWC, nextSegmentClipped, nextSegmentCulled, clippedNextEC);
                    bool segmentClipped, segmentCulled;
                    vec4 clippedPositionWC, clippedPositionEC;
                    clipLineSegmentToNearPlane(positionEC.xyz, usePrevious ? prevEC.xyz : nextEC.xyz, clippedPositionWC, segmentClipped, segmentCulled, clippedPositionEC);
                    if (segmentCulled)
                    {
                        return vec4(0.0, 0.0, 0.0, 1.0);
                    }
                    vec2 directionToPrevWC = normalize(clippedPrevWC.xy - clippedPositionWC.xy);
                    vec2 directionToNextWC = normalize(clippedNextWC.xy - clippedPositionWC.xy);
                    if (prevSegmentCulled)
                    {
                        directionToPrevWC = -directionToNextWC;
                    }
                    else if (nextSegmentCulled)
                    {
                        directionToNextWC = -directionToPrevWC;
                    }
                    vec2 thisSegmentForwardWC, otherSegmentForwardWC;
                    if (usePrevious)
                    {
                        thisSegmentForwardWC = -directionToPrevWC;
                        otherSegmentForwardWC = directionToNextWC;
                    }
                    else
                    {
                        thisSegmentForwardWC = directionToNextWC;
                        otherSegmentForwardWC =  -directionToPrevWC;
                    }
                    vec2 thisSegmentLeftWC = vec2(-thisSegmentForwardWC.y, thisSegmentForwardWC.x);
                    vec2 leftWC = thisSegmentLeftWC;
                    float expandWidth = width * 0.5;
                    if (!czm_equalsEpsilon(prevEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1) && !czm_equalsEpsilon(nextEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1))
                    {
                        vec2 otherSegmentLeftWC = vec2(-otherSegmentForwardWC.y, otherSegmentForwardWC.x);
                        vec2 leftSumWC = thisSegmentLeftWC + otherSegmentLeftWC;
                        float leftSumLength = length(leftSumWC);
                        leftWC = leftSumLength < czm_epsilon6 ? thisSegmentLeftWC : (leftSumWC / leftSumLength);
                        vec2 u = -thisSegmentForwardWC;
                        vec2 v = leftWC;
                        float sinAngle = abs(u.x * v.y - u.y * v.x);
                        expandWidth = clamp(expandWidth / sinAngle, 0.0, width * 2.0);
                    }
                    vec2 offset = leftWC * expandDirection * expandWidth * czm_pixelRatio;
                    return vec4(clippedPositionWC.xy + offset, -clippedPositionWC.z, 1.0) * (czm_projection * clippedPositionEC).w;
                }
                vec4 getPolylineWindowCoordinates(vec4 position, vec4 previous, vec4 next, float expandDirection, float width, bool usePrevious, out float angle)
                {
                    vec4 positionEC = czm_modelViewRelativeToEye * position;
                    vec4 prevEC = czm_modelViewRelativeToEye * previous;
                    vec4 nextEC = czm_modelViewRelativeToEye * next;
                    return getPolylineWindowCoordinatesEC(positionEC, prevEC, nextEC, expandDirection, width, usePrevious, angle);
                }

                attribute vec3 position3DHigh;
                attribute vec3 position3DLow;
                attribute vec3 prevPosition3DHigh;
                attribute vec3 prevPosition3DLow;
                attribute vec3 nextPosition3DHigh;
                attribute vec3 nextPosition3DLow;
                attribute vec2 expandAndWidth;
                attribute vec2 st;
                attribute float batchId;

                varying float v_width;
                varying vec2 v_st;
                varying float v_polylineAngle;
                
                varying vec4 v_positionEC;
                varying vec3 v_normalEC;
                void main()
                {
                float expandDir = expandAndWidth.x;
                float width = abs(expandAndWidth.y) + 0.5;
                bool usePrev = expandAndWidth.y < 0.0;

                vec4 p = czm_computePosition();
                vec4 prev = czm_computePrevPosition();
                vec4 next = czm_computeNextPosition();
                
                float angle;
                vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, angle);
                gl_Position = czm_viewportOrthographic * positionWC;
                
                v_width = width;
                v_st.s = st.s;
                v_st.t = st.t;
                // v_st.t = czm_writeNonPerspective(st.t, gl_Position.w);
                v_polylineAngle = angle;


                
                vec4 eyePosition = czm_modelViewRelativeToEye * p;
                v_positionEC =  czm_inverseModelView * eyePosition;      // position in eye coordinates
                //v_normalEC = czm_normal * normal;                         // normal in eye coordinates
                }

            `,
            fragmentShaderSource: fragmentShaderSource
        })
        return aper
    }

    show() {
        if (this.dataSources) {
            this.dataSources.show = true
        }
        if (this.flylineentity) {
            this.flylineentity.show = true
        }
        if (this.trplist && this.trplist.length > 0) {
            for (var i = 0; i < this.trplist.length; i++) {
                this.trplist[i].show = true
                this.trplist[i].startAnimate()
            }
        }
    }

    hide() {
        if (this.trplist && this.trplist.length > 0) {
            for (var i = 0; i < this.trplist.length; i++) {
                this.trplist[i].closeAnimate()
                this.trplist[i].show = false
            }
        }
        if (this.dataSources) {
            this.dataSources.show = false
        }
        if (this.flylineentity) {
            this.flylineentity.show = false
        }
    }

    remove() {
        if (this.flylineentity) {
            this.flylineentity.destroy()
            this.flylineentity = null
        }
        if (this.dataSources) {
            this.viewer.dataSources.remove(this.dataSources)
            this.dataSources = null
        }
        this.trplist = []
    }
}

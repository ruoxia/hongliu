import { createImageryProvider, createTerrainProvider, areacluster } from '../js/loadmapProvider'
import store from '../store/index'
var echarts = require('echarts')
var pointstatis = {
    add(viewer) {
        var this_ = this
        var al = new areacluster(window.viewer, {
            maxheight: 5000,
            minheight: 2500
        })
        var walllist = [{
                positions: [
                    112.666679, 35.699997, 0.000000,
                    112.715782, 35.699989, 0.000000,
                    112.705994, 35.679314, 0.000000,
                    112.729988, 35.676205, 0.000000,
                    112.729973, 35.674404, 0.000000,
                    112.734169, 35.674397, 0.000000,
                    112.734154, 35.669800, 0.000000,
                    112.725014, 35.669807, 0.000000,
                    112.725136, 35.673183, 0.000000,
                    112.714981, 35.675266, 0.000000,
                    112.712860, 35.672646, 0.000000,
                    112.703995, 35.674438, 0.000000,
                    112.703201, 35.671791, 0.000000,
                    112.692116, 35.671661, 0.000000,
                    112.692169, 35.660225, 0.000000,
                    112.656815, 35.666321, 0.000000,
                    112.643036, 35.666340, 0.000000,
                    112.658394, 35.704113, 0.000000,
                    112.666656, 35.704159, 0.000000,
                    112.666679, 35.699997, 0.000000
                ],
                prop: {
                    id: '001',
                    name: '区域1'
                },
                maxheight: -80,
                minheight: -350,
                color: Cesium.Color.BLUE,
            },
            // {
            //     positions: [
            //         112.7286071, 35.6664507, 1.0, 112.7422459, 35.6540317, 1.0, 112.7414623, 35.6520376, 1.0, 112.734522, 35.6584232, 1.0, 112.7308378, 35.6552125, 1.0, 112.7233579, 35.6621703, 1.0,
            //         112.7286071, 35.6664507, 1.0
            //     ],
            //     prop: {
            //         id: '002',
            //         name: '区域2'
            //     },
            //     maxheight: 120,
            //     minheight: 0,
            //     color: Cesium.Color.RED
            // },
            // {
            //     positions: [112.72923, 35.6706511, 1.0, 112.7348366, 35.6681005, 1.0, 112.7279847, 35.6673893, 1.0, 112.7266483, 35.6681828, 1.0, 112.72923, 35.6706511, 1.0],
            //     prop: {
            //         id: '003',
            //         name: '区域3'
            //     },
            //     maxheight: 120,
            //     minheight: 0,
            //     color: Cesium.Color.AQUA
            // }
        ]
        al.showwalllist(walllist)

        var clusterpoints = [{
                position: [112.7142848, 35.6764136, -50],
                style: { num: 34, size: this_.getCircleDiameter(34), color: '#ff0000' },
                prop: {
                    id: 'z0001',
                    center: {
                        x: 112.7142848,
                        y: 35.6764136,
                        z: 1200
                    }
                }
            },
            {
                position: [112.7006968, 35.6792512, -50],
                style: { num: 107, size: this_.getCircleDiameter(107), color: '#4CAF50' },
                prop: {
                    id: 'z0002',
                    center: {
                        x: 112.7006968,
                        y: 35.6792512,
                        z: 1200
                    }
                }
            },
            {
                position: [112.6896924, 35.6821420, -50],
                style: { num: 98, size: this_.getCircleDiameter(98), color: '#ff0000' },
                prop: {
                    id: 'z0003',
                    center: {
                        x: 112.6896924,
                        y: 35.6821420,
                        z: 1200
                    }
                }
            },
            {
                position: [112.6760452, 35.6828125, -50],
                style: { num: 112, size: this_.getCircleDiameter(112), color: '#4CAF50' },
                prop: {
                    id: 'z0004',
                    center: {
                        x: 112.6760452,
                        y: 35.6828125,
                        z: 1200
                    }
                }
            },
            {
                position: [112.6664878, 35.6862922, -50],
                style: { num: 68, size: this_.getCircleDiameter(68), color: '#ff0000' },
                prop: {
                    id: 'z0005',
                    center: {
                        x: 112.6664878,
                        y: 35.6862922,
                        z: 1200
                    }
                }
            }
        ]
        al.showclusterpointlist(clusterpoints)
        al.updateshow()

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

        var tp1 = new CTMap.tooltip(viewer)
        var tp2 = new CTMap.tooltip(viewer, 'jiankongdialog')
        var tp3 = new CTMap.tooltip(viewer, 'shipindialog')
        var tp4 = new CTMap.tooltip(viewer, 'peopledialog')
        var clickpoint = null
            // 点击
        handler.setInputAction(function(movement) {
            var fea = viewer.scene.pick(movement.position)
            this_.clearPopup([tp1, tp2, tp3, tp4])
            clickpoint = null
            if (fea) {
                if (fea.id) {
                    if (fea.id.layertype && fea.id.layertype === 'statiscluster') {
                        // 聚合
                        if (fea.id.prop) {
                            viewer.camera.flyTo({
                                destination: Cesium.Cartesian3.fromDegrees(fea.id.prop.center.x, fea.id.prop.center.y, fea.id.prop.center.z), // 经度、纬度、高度
                                complete: function() {
                                    al.updateshow()
                                    var fle = null
                                    if (window.facilitypointList) {
                                        for (var f in window.facilitypointList) {
                                            if (window.facilitypointList[f] && window.facilitypointList[f].updateshow) {
                                                window.facilitypointList[f].updateshow()
                                                fle = window.facilitypointList[f]
                                            }
                                        }
                                    }
                                    var ents = fle.dataSources.entities._entities._array
                                    this_.showtimechange(ents[ents.length - 1])
                                }
                            })
                        }
                    } else if (fea.id.layertype && (fea.id.layertype === 'cgqpoint')) {

                        var posit = fea.id.position.getValue()
                        var ellipsoid = window.viewer.scene.globe.ellipsoid;

                        var cartographic = ellipsoid.cartesianToCartographic(posit);
                        var lat = Cesium.Math.toDegrees(cartographic.latitude);
                        var lng = Cesium.Math.toDegrees(cartographic.longitude);
                        var alt = cartographic.height + 1;

                        window.viewer.camera.flyTo({
                            destination: window.Cesium.Cartesian3.fromDegrees(lng, lat, alt), // 经度、纬度、高度
                            orientation: {
                                heading: window.Cesium.Math.toRadians(0), // 绕垂直于地心的轴旋转
                                pitch: window.Cesium.Math.toRadians(-90), // 绕纬度线旋转
                                roll: 0 // 绕经度线旋转
                            },
                            duration: 1 // 飞行到目的地花费时间3秒
                        })

                        // 图标点

                    } else if (fea.id.layertype && (fea.id.layertype === 'cgqmodel')) {
                        clickpoint = fea.id
                        var tname = fea.id.property.Name;
                        //改变颜色
                        fea.id.model.color = Cesium.Color.fromAlpha(Cesium.Color.RED, 1)
                        var tp, content, head
                        switch (tname) {
                            //安全监控系统
                            case 'systemModelLabel/安全监控系统/二氧化碳传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content"style="height:320px">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A二氧化碳</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo"  class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：二氧化碳</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_粉尘传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content"style="height:320px">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A粉尘传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo"  class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：粉尘传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_风流压力.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A风流</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：风流</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_风门开闭传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A风门开闭传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：风门开闭传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/风速传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A风速传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：风速传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_风筒风量传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A风筒风量传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：风筒风量传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_负压传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A负压传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：负压传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/高低浓甲烷.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A高低浓甲烷</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：高低浓甲烷</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_管道多参数传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A管道多参数传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：管道多参数传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_管道瓦斯传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A管道瓦斯传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：管道瓦斯传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/管道一氧化碳.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A一氧化碳</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：一氧化碳</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_井下监控分站.gltf':
                                // 安全监控系统--分站
                                head = '<div>安全监控系统</div> <span>类型：分站</span>'
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this">分站信息</li>
                                        <li>详细信息</li>
                                    </ul>
                                    <div class="layui-tab-content " style="height:300px" >
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable"  >
                                            <tbody  align="center" valign="middle"  >
                                        <tr>
                                        <td >分站编号：</td><td style="width:95px;height:40px">41</td>
                                        <td >通讯状态:</td><td>正常</td>
                                        <td >手控状态：</td><td><img src="img/dialog/u749.svg" alt="" ></td>
                                        <td>故障异控:</td><td><img src="img/dialog/u750.svg" alt="" ></td>
                                        
                                        </tr>
                                        
                                        
                                        </tbody>

                                        </table>
                                        </div>
                                        <div class="layui-tab-item"> 
                                        <table class="layuitable" >
                                            <thead bgcolor="#0777aacc"  align="center" valign="middle">
                                        <tr>
                                        <th >序号</th>
                                        <th >测点</th>
                                        <th>安装位置</th>
                                        <th>监测值</th>
                                        <th>实时状态</th>
                                        <th>预警级别</th>
                                        <th>逻辑状态</th>
                                        <th>更新时间</th>
                                        
                                        </tr> 
                                    </thead>
                                    <tbody  align="center" valign="middle" style="height:210px;width: 690px; ">
                                        <tr>
                                        <td>1</td>
                                        <td >007安全监控分站V1.0</td>
                                        <td>测试7号分站</td>
                                        <td></td>
                                        <td bgcolor="#297c58">交流供电</td>
                                        <td></td>
                                        <td>正常</td>
                                        <td>09:53:46</td>
                                        
                                        </tr>
                                        <tr>
                                        <td>2</td>
                                    <td style="text-decoration:underline">0070101A低浓激光甲烷</td>
                                    <td bgcolor="#5480d6"></td>
                                        <td>0%</td>
                                        <td bgcolor="#297c58">正常</td>
                                        <td>--</td>
                                        <td>正常</td>
                                        <td>09:53:46</td>
                                    
                                        </tr>
                                        <tr>
                                        <td>3</td>
                                    <td style="text-decoration:underline">0070102A风速</td>
                                    <td bgcolor="#5480d6"></td>
                                        <td>--</td>
                                        <td bgcolor="#b2d838">中断/断线</td>
                                        <td>--</td>
                                        <td>正常</td>
                                        <td>09:53:46</td>
                                    
                                        </tr>
                                        <tr>
                                        <td>4</td>
                                    <td style="text-decoration:underline">0070103A低浓激光甲烷</td>
                                    <td bgcolor="#5480d6"></td>
                                        <td>0%</td>
                                        <td bgcolor="#297c58">正常</td>
                                        <td>--</td>
                                        <td>正常</td>
                                        <td>09:53:46</td>
                                    
                                        </tr>
                                        <tr>
                                        <td>5</td>
                                    <td style="text-decoration:underline">0070104D风向传感器</td>
                                    <td bgcolor="#5480d6"></td>
                                        <td>反风</td>
                                        <td bgcolor="#297c58">正常</td>
                                        <td>--</td>
                                        <td>正常</td>
                                        <td>09:53:46</td>
                                    
                                        </tr>
                                        <tr>
                                        <td>6</td>
                                    <td style="text-decoration:underline">0070105A高浓激光甲烷</td>
                                    <td bgcolor="#5480d6"></td>
                                        <td>--</td>
                                        <td bgcolor="red">故障</td>
                                        <td>--</td>
                                        <td>正常</td>
                                        <td>09:53:46</td>
                                    
                                        </tr>
                                        </tbody>
                                            </div>
                                    
                                    </div>
                                    </div>`
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_井下终端.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A井下终端</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：井下终端</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_局部通风机.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A局部通风机</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：局部通风机</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_开停传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A开停传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：开停传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_馈电传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A馈电传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：馈电传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_馈电断电器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A馈电断电器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：馈电断电器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_流量开关.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A流量开关</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：流量开关</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_声光报警器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A声光报警器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：声光报警器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/温度传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A温度传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：温度传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_烟雾传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A烟雾传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：烟雾传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/氧气传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A氧气传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：氧气传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/液位传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                        <table class="layuitable">
                                            <tbody align="center" valign="middle">
                                                <tr>
                                                <td>测点：</td><td>0320105A液位传感器</td>
                                                </tr>
                                                <tr>
                                                <td>实时状态：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>预警级别：</td><td>--</td>
                                                </tr>
                                                <tr>
                                                <td>逻辑状态：</td><td>正常</td>
                                                </tr>
                                                <tr>
                                                <td>监测值：</td><td>故障</td>
                                                </tr>
                                                <tr>
                                                <td>安装位置：</td><td>12煤辅运大巷</td>
                                                </tr>
                                                <tr>
                                                <td>最近标校时间：</td><td>19日17:53:01</td>
                                                </tr>
                                                <tr>
                                                <td>更新时间：</td><td>17:52:59</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                                    </div>
                                    </div> `
                                head = '<div>安全监控系统</div> <span>类型：液位传感器</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/一氧化碳传感器.gltf':
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                          <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                            <table class="layuitable">
                                <tbody align="center" valign="middle">
                                    <tr>
                                    <td>测点：</td><td>0320105A一氧化碳</td>
                                    </tr>
                                    <tr>
                                    <td>实时状态：</td><td>故障</td>
                                    </tr>
                                    <tr>
                                    <td>预警级别：</td><td>--</td>
                                    </tr>
                                    <tr>
                                    <td>逻辑状态：</td><td>正常</td>
                                    </tr>
                                    <tr>
                                    <td>监测值：</td><td>故障</td>
                                    </tr>
                                    <tr>
                                    <td>安装位置：</td><td>12煤辅运大巷</td>
                                    </tr>
                                    <tr>
                                    <td>最近标校时间：</td><td>19日17:53:01</td>
                                    </tr>
                                    <tr>
                                    <td>更新时间：</td><td>17:52:59</td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                                <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                          </div>
                        </div> `
                                head = '<div>安全监控系统</div> <span>类型：一氧化碳</span>'
                                tp = tp2
                                break
                            case 'systemModelLabel/安全监控系统/_风流压力.gltf':
                                // 人员定位--车辆
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                      <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show">
                        <table class="layuitable">
                        <tbody align="center" valign="middle">
                            <tr>
                            <td>车辆编号：</td><td>XXX</td><td rowspan="10"><img src="img/dialog/car.jpg" alt="" width="120" ></td>
                            </tr>
                            <tr>
                            <td>车辆名称：</td><td>XXX</td>
                            </tr>
                            <tr>
                            <td>识别卡号：</td><td>25654</td>
                            </tr>
                            <tr>
                            <td>车辆类型：</td><td>卡车</td>
                            </tr>
                            <tr>
                            <td>所属部门：</td><td>机电科</td>
                            </tr>
                            <tr>
                            <td>当前区域：</td><td>21102轨道巷（外） 09:53:46</td>
                            </tr>
                            <tr>
                            <td>当前位置：</td><td></td>
                            </tr>
                            <tr>
                            <td>下井时间：</td><td>2021-07-15 08:24:54</td>
                            </tr>
                            <tr>
                            <td>监测时间：</td><td>2021-07-15 09:53:46</td>
                            </tr>
                            <tr>
                            <td>坐标：</td><td></td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                        <button type="button" id="routePath" class="layui-btn">轨迹回放</button>
                      
                      </div>
                    </div> `
                                head = '<div>人员定位系统</div> <span>类型：车辆</span>'
                                tp = tp4
                                break
                            case 'systemModelLabel/视频监控系统/_视频摄像头.gltf':
                                // 摄像头
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                      <div class="layui-tab-content">
                      <div class="layui-tab-item layui-show">
                      
                              
                                  <img src="img/dialog/video.png" width="280">
                              
                                  <div class="attribute"> 所属系统：排水系统  区域：中央水泵房1</div> 
                             
                     
                      </div>  
                    </div>
                  </div> `
                                head = '<div>视频监控系统</div>'
                                tp = tp3
                                break
                                // 人员定位系统
                            case 'systemModelLabel/人员定位系统/_传输分站.gltf':
                                // 人员分站
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                  <ul class="layui-tab-title">
                                  <li class="layui-this">分站信息</li>
                                  <li>读卡器信息</li>
                                  </ul>
                                  <div class="layui-tab-content"style="height:300px">
                                  <div class="layui-tab-item layui-show">
                                  <table class="layuitable">
                                  <tbody align="center" valign="middle">
                                  <tr>
                                  <td >分站编号：</td><td>41</td><td>分站名称：</td><td>017安全监控分站V0.0</td><td>区域编号：</td><td>二采区</td><td>区域名称</td><td>二采区</td>
                                  </tr>
                                  <tr>
                                  <td>分站状态：</td><td bgcolor="#297c58">交流供电</td><td>更新时间：</td><td>2021-07-05 09:00:01:010 </td><td>最大监测半径(m)：</td><td>无</td><td>精准定位</td><td>是</td>

                                  </tr>
                                  <tr>
                                  <td>精确距离(m)：</td><td>0.01</td><td>坐标位置(x,y,z)：</td><td></td><td>安装位置：</td><td>二采区补掘水仓</td><td></td><td></td>
                                  </tr>
                                  </tbody>
                                  </table>
                                  </div> 
                                  <div class="layui-tab-item">
                                  <table class="layuitable" >
                                  <thead align="center" valign="middle">
                                      <tr>
                                  <td>序号</td><td>读卡器编号</td><td>状态</td><td>读卡器位置</td><td>分站-通道</td><td>读卡器类型</td><td>人数</td><td>监测时间</td>
                                  </tr>
                                  </thead>
                                  <tbody align="center" valign="middle">
                                  <tr>
                                  <td>1</td><td>18</td><td bgcolor="#297c58">正常</td><td class="tdreaderifcard">新副井下口西 </td><td>161-1</td><td>井下定位</td><td>3</td><td>2021-07-15 9:53:46.067</td>

                                  </tr>
                                  <tr>
                                  <td>2</td><td>6</td><td bgcolor="#cc1924">异常</td><td class="tdreaderifcard">新副井下口东 </td><td>161-2</td><td>井下定位</td><td>1</td><td>2021-07-15 9:53:46.067</td>
                                  </tr>
                                  <tr>
                                  <td>3</td><td>69</td><td bgcolor="#297c58">正常</td><td class="tdreaderifcard">东翼集中皮带</td><td>143-2</td><td>井下定位</td><td>2</td><td>2021-07-15 9:53:46.067</td>
                                  </tr>
                                  <tr>
                                  <td>4</td><td>74</td><td bgcolor="#297c58">正常</td><td class="tdreaderifcard">暗斜巷 </td><td>161-1</td><td>井下定位</td><td>2</td><td>2021-07-15 9:53:46.067</td>
                                  </tr>
                                  </tbody>
                                  </table>
                                  </div> 
                                </div>
                              </div> `
                                head = '<div>人员定位系统</div> <span>类型：分站</span>'
                                tp = tp4
                                break
                            case 'systemModelLabel/人员定位系统/_读卡分站.gltf':
                                // 人员
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                                  <div class="layui-tab-content" >
                                    <div class="layui-tab-item layui-show">
                                    <table class="layuitable">
                                    <tbody align="center" valign="middle">
                                    <tr>
                                    <td>姓名：</td><td>马增军</td><td rowspan="9"><img src="img/dialog/renyuan.jpg" alt="" width="90" ></td>
                                    </tr>
                                    <tr>
                                    <td>工号：</td><td>20859</td>
                                    </tr>
                                    <tr>
                                    <td>部门：</td><td>通防科</td>
                                    </tr>
                                    <tr>
                                    <td>职务：</td><td>辅助员工</td>
                                    </tr>
                                    <tr>
                                    <td>下井时间：</td><td>2021-07-15 08:24:54</td>
                                    </tr>
                                    <tr>
                                    <td>监测时间：</td><td>2021-07-15 09:53:46</td>
                                    </tr>
                                    <tr>
                                    <td>当前人员位置：</td><td></td>
                                    </tr>
                                    <tr>
                                    <td>当前基站位置：</td><td>21102轨道巷(外)</td>
                                    </tr>
                                    <tr>
                                    <td>坐标：</td><td></td>
                                    </tr>
                                    </tbody>
                                    </table>
                                    </div>
                                    <button type="button" id="routePath" class="layui-btn">轨迹回放</button>

                                  </div>
                                </div> `
                                head = '<div>人员定位系统</div> <span>类型：人员</span>'
                                tp = tp4
                                break
                            case './SampleData/models/传感器设备/传感器设备_data/GWD200.gltf':
                                // 安全监控系统--分站
                                head = '<div>安全监控系统</div> <span>类型：分站</span>'
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                      <ul class="layui-tab-title">
                        <li class="layui-this">分站信息</li>
                        <li>详细信息</li>
                      </ul>
                      <div class="layui-tab-content " style="height:300px" >
                        <div class="layui-tab-item layui-show">
                        <table class="layuitable"  >
                            <tbody  align="center" valign="middle"  >
                        <tr>
                        <td >分站编号：</td><td style="width:95px;height:40px">41</td>
                        <td >通讯状态:</td><td>正常</td>
                        <td >手控状态：</td><td><img src="img/dialog/u749.svg" alt="" ></td>
                        <td>故障异控:</td><td><img src="img/dialog/u750.svg" alt="" ></td>
                        
                        </tr>
                        
                        
                        </tbody>

                        </table>
                        </div>
                        <div class="layui-tab-item"> 
                        <table class="layuitable" >
                            <thead bgcolor="#0777aacc"  align="center" valign="middle">
                        <tr>
                          <th >序号</th>
                          <th >测点</th>
                          <th>安装位置</th>
                          <th>监测值</th>
                          <th>实时状态</th>
                          <th>预警级别</th>
                          <th>逻辑状态</th>
                          <th>更新时间</th>
                          
                        </tr> 
                      </thead>
                      <tbody  align="center" valign="middle" style="height:210px;width: 690px; ">
                        <tr>
                        <td>1</td>
                        <td >007安全监控分站V1.0</td>
                        <td>测试7号分站</td>
                        <td></td>
                        <td bgcolor="#297c58">交流供电</td>
                        <td></td>
                        <td>正常</td>
                        <td>09:53:46</td>
                        
                        </tr>
                        <tr>
                        <td>2</td>
                      <td style="text-decoration:underline">0070101A低浓激光甲烷</td>
                      <td bgcolor="#5480d6"></td>
                        <td>0%</td>
                        <td bgcolor="#297c58">正常</td>
                        <td>--</td>
                        <td>正常</td>
                        <td>09:53:46</td>
                      
                        </tr>
                        <tr>
                        <td>3</td>
                      <td style="text-decoration:underline">0070102A风速</td>
                      <td bgcolor="#5480d6"></td>
                        <td>--</td>
                        <td bgcolor="#b2d838">中断/断线</td>
                        <td>--</td>
                        <td>正常</td>
                        <td>09:53:46</td>
                      
                        </tr>
                        <tr>
                        <td>4</td>
                      <td style="text-decoration:underline">0070103A低浓激光甲烷</td>
                      <td bgcolor="#5480d6"></td>
                        <td>0%</td>
                        <td bgcolor="#297c58">正常</td>
                        <td>--</td>
                        <td>正常</td>
                        <td>09:53:46</td>
                      
                        </tr>
                        <tr>
                        <td>5</td>
                      <td style="text-decoration:underline">0070104D风向传感器</td>
                      <td bgcolor="#5480d6"></td>
                        <td>反风</td>
                        <td bgcolor="#297c58">正常</td>
                        <td>--</td>
                        <td>正常</td>
                        <td>09:53:46</td>
                      
                        </tr>
                        <tr>
                        <td>6</td>
                      <td style="text-decoration:underline">0070105A高浓激光甲烷</td>
                      <td bgcolor="#5480d6"></td>
                        <td>--</td>
                        <td bgcolor="red">故障</td>
                        <td>--</td>
                        <td>正常</td>
                        <td>09:53:46</td>
                      
                        </tr>
                        </tbody>
                            </div>
                      
                      </div>
                    </div>`
                                tp = tp2
                                break
                            case './SampleData/models/传感器设备/传感器设备_data/GSY10.gltf':
                                // 安全监控系统--CO2
                                head = '<div>安全监控系统</div> <span>类型：二氧化碳传感器</span>'
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                    <div class="layui-tab-content">
                      <div class="layui-tab-item layui-show">
                      <table class="layuitable">
                          <tbody align="center" valign="middle">
                              <tr>
                              <td>测点：</td><td>0320105A二氧化碳</td>
                              </tr>
                              <tr>
                              <td>实时状态：</td><td>故障</td>
                              </tr>
                              <tr>
                              <td>预警级别：</td><td>--</td>
                              </tr>
                              <tr>
                              <td>逻辑状态：</td><td>正常</td>
                              </tr>
                              <tr>
                              <td>监测值：</td><td>故障</td>
                              </tr>
                              <tr>
                              <td>安装位置：</td><td>12煤辅运大巷</td>
                              </tr>
                              <tr>
                              <td>最近标校时间：</td><td>19日17:53:01</td>
                              </tr>
                              <tr>
                              <td>更新时间：</td><td>17:52:59</td>
                              </tr>
                          </tbody>
                      </table>
                      </div>
                          <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                    </div>
                  </div> `
                                tp = tp2
                                break
                            case './SampleData/models/传感器设备/传感器设备_data/GYH25(B).gltf':
                                // 安全监控系统-- 02
                                head = '<div>安全监控系统</div> <span>类型：O2</span>'
                                content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                    <div class="jiankongdialoglayui-tab-content">
                      <div class="layui-tab-item layui-show">
                      <table class="layuitable">
                          <tbody align="center" valign="middle">
                              <tr>
                              <td>测点：</td><td>0320105A O2</td>
                              </tr>
                              <tr>
                              <td>实时状态：</td><td>故障</td>
                              </tr>
                              <tr>
                              <td>预警级别：</td><td>--</td>
                              </tr>
                              <tr>
                              <td>逻辑状态：</td><td>正常</td>
                              </tr>
                              <tr>
                              <td>监测值：</td><td>故障</td>
                              </tr>
                              <tr>
                              <td>安装位置：</td><td>12煤辅运大巷</td>
                              </tr>
                              <tr>
                              <td>最近标校时间：</td><td>19日17:53:01</td>
                              </tr>
                              <tr>
                              <td>更新时间：</td><td>17:52:59</td>
                              </tr>
                          </tbody>
                      </table>
                      </div>
                          <button type="button" id="shebeiinfo" class="layui-btn">设备信息</button>
                    </div>
                  </div> `
                                tp = tp2
                                break
                        }

                        //this_.showtimechange(ftimeea.id)
                        this_.showpopup(tp, fea, head, content)

                    }

                    $('#shebeiinfo').click(function() {
                        this_.clearPopup([tp1, tp2, tp3, tp4])
                        tp = tp2
                        content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                  <ul class="layui-tab-title">
                    <li class="layui-this">设备参数</li>
                    <li>数据查询</li>
                  </ul>
                  <div class="layui-tab-content" style="height: 300px;">
                    <div class="layui-tab-item layui-show">
                    <table class="layuitable"align="center" valign="middle">
                        <tr>
                        <td rowspan="2"><img src="img/dialog/jw.jpg" width="100"></td><td style="width:180px" ><div>1.48%</div> 时间：19日 17:57:36 状态：报警</td>
                        </tr>
                        <tr>
                        <td class="jw">测点编号：0320611A 安装位置：12煤辅运大巷 生产厂家： 生产编号 出厂日期: 安装日期: 报警上下限：<0或>=1% 高断电设置：无 低断电设置：无</td>
                        </tr>
                    </table>
                    </div>
                    <div class="layui-tab-item">
                      <div class="layui-form">
                        <div class="layui-form-item">
                          <div class="layui-inline">
                            <label class="layui-form-label">开始：</label>
                            <div class="layui-input-inline">
                              <input type="text" class="layui-input" id="test1" placeholder="yyyy-MM-dd" style="color:#000000">
                            </div>
                          </div>
                          <div class="layui-inline">
                            <label class="layui-form-label">结束：</label>
                            <div class="layui-input-inline">
                              <input type="text" class="layui-input" id="test2" placeholder="yyyy-MM-dd" style="color:#000000">
                            </div>
                          </div>
                        </div>
                        <div id="echartEle" style="width:570px;height:230px"></div>
                    
                    
                    </div>   
                  </div>
                </div> `
                        head = '<div>安全监控系统</div> <span>类型：设备</span>'

                        this_.showpopup(tp, fea, head, content)
                    })
                    $('#routePath').click(function() {
                        //         this_.clearPopup([tp1, tp2, tp3, tp4])
                        //         tp = tp4
                        //         head = '<div>轨迹回放信息</div>'
                        //         content = `<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                        //     <div class="layui-tab-content" style="height: 420px;">
                        //       <div class="layui-tab-item layui-show">
                        //       <table class="layuitable">
                        //       <tbody  align="center" valign="middle">
                        //           <tr>
                        //           <td style="font-size:20px; color:yellow">人员信息</td><td></td><td rowspan="12"><img src="./img/弹框/u558.jpg" alt="" width="50" ></td>
                        //           <tr>
                        //           <td>姓名：</td><td>马增军</td>  
                        //           </tr>
                        //           <tr>
                        //           <td>工号：</td><td>20859</td>
                        //           </tr>
                        //           <tr>
                        //           <td>职务：</td><td>辅助员工</td>
                        //           </tr>
                        //           <td style="font-size:20px; color:yellow">人员信息</td><td></td>
                        //           <tr>
                        //           <td>总里程：</td><td>7320.04</td>
                        //           </tr>
                        //           <tr>
                        //           <td>剩余里程：</td><td>7320.04</td>
                        //           </tr>
                        //           <tr>
                        //           <td>当前站：</td><td>井口上（环）</td>
                        //           </tr>
                        //           <tr>
                        //           <td>下一站：</td><td>井口上（环）</td>
                        //           </tr>
                        //           <tr>
                        //           <td>下一站距离：</td><td>405.25</td>
                        //           </tr>
                        //           <tr>
                        //           <td>下一站到站：</td><td>2021-07-19 05:30:31</td>
                        //           </tr>
                        //           <tr>
                        //           <td>所在巷道：</td><td>副井</td>
                        //           </tr>
                        //       </table>
                        //       <button type="button" id='startpos' class="layui-btn btn1">开始</button>
                        //       <button type="button" id='reducepos' class="layui-btn btn2">减速</button>                     
                        //       <button type="button" id="addpos" class="layui-btn btn4">加速</button>
                        //       <button type="button" id="stoppos" class="layui-btn btn5">停止</button>
                        //       </div>      
                        //     </div>
                        //   </div> `

                        //         this_.showpopup(tp, fea, head, content)
                        // window.showpeopleid = window.showpeopleid ? window.showpeopleid++ : 0
                        store.state.functionMenu.nowMenuName = 'locus'
                            // $('#startpos').click(function() {
                            //     viewer.clock.shouldAnimate = true
                            //         // var _this = this
                            //         // Cesium.Resource.fetchJson('data/line.json').then(function (jsonData) {
                            //         //     _this.pointList = jsonData

                        //     //     _this.loadTaskRout()
                        //     //     _this.setClock()
                        //     // })
                        // })

                        // $('#reducepos').click(function() {
                        //     viewer.clock.multiplier = viewer.clock.multiplier * 0.9
                        // })
                        // $('#addpos').click(function() {
                        //     viewer.clock.multiplier = viewer.clock.multiplier * 1.1
                        // })
                        // $('#stoppos').click(function() {
                        //     viewer.clock.shouldAnimate = false
                        // })
                    })

                    // else if (fea.id.layertype && fea.id.layertype === 'cgqmodel') {
                    //   // 模型
                    //   var property = fea.id.property
                    //   this_.showpopup(tp2, fea)
                    // }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        var name = {
            './SampleData/gltf/jw.gltf': '甲烷',
            './SampleData/models/传感器设备/传感器设备_data/GRG5H(B).gltf': 'GRG5H(B)',
            './SampleData/models/传感器设备/传感器设备_data/GELH100.gltf': 'GELH100',
            './SampleData/models/传感器设备/传感器设备_data/GFY15.gltf': 'GFY15',
            './SampleData/models/传感器设备/传感器设备_data/GLH100.gltf': 'GLH100',
            './SampleData/models/传感器设备/传感器设备_data/GTH1000.gltf': 'GTH1000',
            './SampleData/models/传感器设备/传感器设备_data/GWD200.gltf': 'GWD200',
            './SampleData/models/传感器设备/传感器设备_data/GSY10.gltf': 'GSY10',
            './SampleData/models/传感器设备/传感器设备_data/GYH25(B).gltf': 'GYH25(B)'
        }
        handler.setInputAction(function(movement) {
            var fea = viewer.scene.pick(movement.endPosition)
            this_.clearPopup([tp1])
            if (fea) {
                if (fea.id) {
                    if (clickpoint === fea.id) {
                        return
                    }
                    if (fea.id.layertype && fea.id.layertype === 'cgqpoint') {
                        // 图标点
                        var property = fea.id.property
                        var propertyName = property.Name.split('/')[2].split('.')[0];
                        var titleName = property.Name.split('/')[1];
                        tp1.add({
                            geometry: fea.id.position.getValue(),
                            content: {
                                header: titleName,
                                isclose: false,
                                content: `
                                    <div><span>名称：</span><span>${propertyName}</span></div>
                                    <div><span>监测值：</span><span>454</span></div>
                                    `
                            }
                        })
                    } else if (fea.id.layertype && fea.id.layertype === 'cgqmodel') {
                        // 模型
                        var property = fea.id.property
                        var propertyName = property.Name.split('/')[2].split('.')[0];
                        var titleName = property.Name.split('/')[1];
                        tp1.add({
                            geometry: fea.id.position.getValue(),
                            content: {
                                header: titleName,
                                isclose: false,
                                content: `
                                    <div><span>名称：</span><span>${propertyName}</span></div>
                                    <div><span>监测值：</span><span>454</span></div>
                                    `
                            }
                        })
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    // 获取圆的直径
    getCircleDiameter(d) {
        var size = (d > 40) ? d : 40
        return size
    },
    // 清除弹框
    clearPopup(list) {
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].className === 'popupdialog' && document.querySelector('#routePath') === null && store.state.functionMenu.nowMenuName === 'locus') {
                    store.state.functionMenu.nowMenuName = ''
                }
                list[i].closeAll()
            }
        }
    },

    // 显示弹框
    showpopup(tp, fea, head, content) {
        var laydate = window.layui.laydate
            // 常规用法

        var _t = this
        var property = fea.id.property
        if (content == undefined || content === '') {
            content = `<div><span>名称：</span><span>aaa</span></div>
                  <div><span>分数</span><span>454</span></div>`
        }
        tp.add({
            geometry: fea.id.position.getValue(),
            content: {
                header: head,
                isclose: true,
                content: content
            }
        })
        if (head == '<div>安全监控系统</div> <span>类型：设备</span>') {
            _t.addEchart(laydate)
        }
    },
    addEchart(laydate) {
        const thisDate = new Date()
        var hisPandding = 7 * 24
        var historyEnd = this.getAnyFormatDate1(thisDate)
        const nowFotmate = this.getAnyFormatDate2(thisDate)
        const mydate = new Date(thisDate.getTime() - hisPandding * 60 * 60 * 1000)
        var historyStart = this.getAnyFormatDate1(mydate)
        const paddingFotmate = this.getAnyFormatDate2(mydate)
        layui.use('laydate', function() {
            var laydate = layui.laydate
            laydate.render({
                elem: '#test1',
                type: 'datetime',
                calendar: true,
                max: 0,
                format: 'y年MM月dd日HH点mm分', // 可任意组合
                value: paddingFotmate,
                isInitValue: true,
                done: function(value, date) {
                    $('#test1').html(date)
                        // historyStart = _fomatTimeStr(date);
                        // _showChart(name, objId, color, isareaStyle);
                }
            })
            laydate.render({
                elem: '#test2',
                type: 'datetime',
                calendar: true,
                max: 0,
                value: nowFotmate,
                isInitValue: true,
                format: 'y年MM月dd日HH点mm分',
                done: function(value, date) {
                    // historyEnd = _fomatTimeStr(date);
                    // _showChart(name, objId, color, isareaStyle);
                }
            })
        })
        const myChart = echarts.init(document.getElementById('echartEle'))

        const label = [233, 233, 200, 180, 199, 233, 210, 180]
        const value = [233, 233, 200, 180, 199, 233, 210, 180]

        myChart.setOption({
            grid: {
                top: 10,
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(255,255,255,0)' // 0% 处的颜色
                            }, {
                                offset: 0.5,
                                color: 'rgba(255,255,255,1)' // 100% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(255,255,255,0)' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    formatter: '{value}',
                    fontSize: 14,
                    margin: 20,
                    textStyle: {
                        color: '#7ec7ff'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#243753'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#243753'
                    }
                },
                axisTick: {
                    show: false
                },
                data: label
            }],
            yAxis: [{
                boundaryGap: false,
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#7ec7ff'
                    }
                },
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    lineStyle: {
                        color: '#243753'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#283352'
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            series: [{
                name: '参数',
                type: 'line',
                smooth: true,
                showSymbol: true,
                symbolSize: 8,
                zlevel: 3,
                itemStyle: {
                    color: '#19a3df',
                    borderColor: '#a3c8d8'
                },
                lineStyle: {
                    normal: {
                        width: 6,
                        color: '#19a3df'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1, [{
                                    offset: 0,
                                    color: 'rgba(88,255,255,0.2)'
                                },
                                {
                                    offset: 0.8,
                                    color: 'rgba(88,255,255,0)'
                                }
                            ],
                            false
                        )
                    }
                },
                data: value
            }]
        })
    },
    loadTaskRout() {
        alert('a3a')
        var _this = this
        var start = CTMap.JulianDate.fromDate(new Date())
        var keyPos = new CTMap.SampledPositionProperty()
        keyPos.backwardExtrapolationDuration = 2
        keyPos.backwardExtrapolationType = CTMap.ExtrapolationType.HOLD
        keyPos.forwardExtrapolationType = CTMap.ExtrapolationType.HOLD
        var orientation = new CTMap.VelocityOrientationProperty(keyPos)
        var points = []
        for (var j = 0; j < _this.pointList.length; j++) {
            var ctime = CTMap.JulianDate.addSeconds(start, 8 + j * 6, new CTMap.JulianDate())

            var position = Cesium.Cartesian3.fromDegrees(_this.pointList[j].longitude, _this.pointList[j].latitude, _this.pointList[j].height)
            points.push(position)
            keyPos.addSample(ctime, position)
        }
    },
    setClock() {
        var _this = this
        var times = window.cesiumvariate.modelEntity.position._property._times
        var start = times[0]
        var end = times[times.length - 1]
        viewer.clock.startTime = start
        viewer.clock.stopTime = end
        viewer.clock.currentTime = start
        viewer.clock.clockRange = CTMap.ClockRange.LOOP_STOP
        viewer.clock.multiplier = viewer.clock.multiplier * 1.5 // viewer.clock.multiplier / 2
        viewer.flyTo(window.cesiumvariate.animation)
        viewer.clock.shouldAnimate = true
    },
    getAnyFormatDate1(date) {
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
            ' ' + date.getHours() + seperator2 + date.getMinutes() +
            seperator2 + date.getSeconds()
        return currentdate
    },
    getAnyFormatDate2(date) {
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var currentdate = date.getFullYear() + '年' + month + '月' + strDate + '日' + date.getHours() + '点' + date.getMinutes() + '分'
        return currentdate
    },
    // 点动画
    showtimechange(ents) {
        var _num = 0
        var w = typeof ents.billboard.width === 'number' ? ents.billboard.width : 48
        var h = typeof ents.billboard.height === 'number' ? ents.billboard.height : 48
        var width = 48
        var size = 48
        ents.billboard.width = new Cesium.CallbackProperty(function() {
            if (_num % 2 === 0) {
                width -= 0.4
            } else {
                width += 0.4
            }
            if (width <= 0.6 * size) {
                _num++
            } else if (width >= size) {
                _num++
            }
            return width
        })
        ents.billboard.height = new Cesium.CallbackProperty(function() {
            return width
        })

        setTimeout(() => {
            ents.billboard.width = w
            ents.billboard.height = h
        }, 5000)
    }

}
export default pointstatis
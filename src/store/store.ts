import { create } from 'zustand';

interface HtmlState {
  htmlCode: string;
  reset: (newHtml: string) => void;
}

const useHtmlStore = create<HtmlState>((set) => ({
  // 初始状态
  htmlCode: `
  <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>函数图像分析工具</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                background-color: #f5f5f5;
            }
            
            .container {
                display: flex;
                gap: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .ggb-container {
                width: 800px;
                height: 600px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .control-panel {
                flex: 1;
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
    
            h1 {
                color: #333;
                margin-bottom: 20px;
            }
    
            .control-group {
                margin-bottom: 20px;
            }
    
            .control-group h3 {
                margin-top: 0;
                color: #444;
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
            }
    
            button {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 15px;
                margin: 5px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            }
    
            button:hover {
                background-color: #45a049;
            }
    
            button.toggle {
                background-color: #2196F3;
            }
    
            button.toggle:hover {
                background-color: #0b7dda;
            }
    
            button.reset {
                background-color: #f44336;
            }
    
            button.reset:hover {
                background-color: #d32f2f;
            }
    
            .slider-container {
                margin: 15px 0;
            }
    
            .slider-container label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
    
            input[type="range"] {
                width: 100%;
            }
    
            .value-display {
                font-size: 14px;
                color: #666;
                margin-top: 5px;
            }
        </style>
    </head>
    <body>
        <h1>函数图像分析工具</h1>
        <div class="container">
            <div class="ggb-container" id="ggb-element"></div>
            <div class="control-panel">
                <div class="control-group">
                    <h3>主函数控制</h3>
                    <button id="toggleMainFunction">显示/隐藏主函数</button>
                    <button id="toggleDerivative">显示/隐藏导数函数</button>
                    <button class="reset" id="resetAll">重置所有</button>
                </div>
    
                <div class="control-group">
                    <h3>参数控制</h3>
                    <div class="slider-container">
                        <label for="kSlider">k 值 (0 < k < 1/3)</label>
                        <input type="range" id="kSlider" min="0.01" max="0.33" step="0.01" value="0.1">
                        <div class="value-display">当前值: <span id="kValue">0.1</span></div>
                    </div>
                </div>
    
                <div class="control-group">
                    <h3>点控制</h3>
                    <button id="toggleP1">显示/隐藏极值点 P1</button>
                    <button id="toggleP2">显示/隐藏零点 P2</button>
                </div>
    
                <div class="control-group">
                    <h3>辅助函数控制</h3>
                    <button id="toggleGfunc">显示/隐藏 g_func(x)</button>
                    <button id="toggleGt">显示/隐藏 g_t(t)</button>
                </div>
            </div>
        </div>
    
        <script src="https://cdn.geogebra.org/apps/deployggb.js"></script>
        <script>
            // GeoGebra parameters
            const parameters = {
                "id": "ggbApplet",
                "appName": "classic",
                "width": 800,
                "height": 600,
                "showMenuBar": true,
                "showAlgebraInput": true,
                "showToolBar": true,
                "showToolBarHelp": true,
                "showResetIcon": true,
                "enableLabelDrags": true,
                "enableShiftDragZoom": true,
                "enableRightClick": true,
                "errorDialogsActive": false,
                "useBrowserForJS": false,
                "allowStyleBar": false,
                "preventFocus": false,
                "showZoomButtons": true,
                "capturingThreshold": 3,
                "showFullscreenButton": true,
                "scale": 1,
                "disableAutoScale": false,
                "allowUpscale": false,
                "clickToLoad": false,
                "buttonRounding": 0.7,
                "buttonShadows": false,
                "language": "zh-CN",
                "appletOnLoad": function(api) {
                    window.ggbApp = api;
                    initializeGeoGebra();
                }
            };
    
            // Initialize GeoGebra
            window.addEventListener('load', function() {
                var applet = new GGBApplet(parameters, true);
                applet.inject('ggb-element');
            });
    
            // Initialize GeoGebra objects
            function initializeGeoGebra() {
                // Create slider for k
                ggbApp.evalCommand('k=Slider(0.01,0.33,0.01,1,140,false,true,false,false)');
                ggbApp.evalCommand('SetValue(k,0.1)');
    
                // Main function
                ggbApp.evalCommand('f(x)=ln(1+x)-x+0.5x^2-kx^3');
    
                // Derivative function (hidden by default)
                ggbApp.evalCommand('f_prime(x)=x^2(1/(1+x)-3k)');
                ggbApp.evalCommand('SetVisibleInView(f_prime,1,false)');
                ggbApp.evalCommand('SetLabel(f_prime,"derivative")');
    
                // Helper function g_func (hidden)
                ggbApp.evalCommand('g_func(x)=1/(1+x)-3k');
                ggbApp.evalCommand('SetVisibleInView(g_func,1,false)');
                ggbApp.evalCommand('SetLabel(g_func,"g_function")');
    
                // x1 value (hidden)
                ggbApp.evalCommand('x1_val=1/(3k)-1');
                ggbApp.evalCommand('SetVisibleInView(x1_val,1,false)');
                ggbApp.evalCommand('SetLabel(x1_val,"x1_value")');
    
                // Point P1 (visible)
                ggbApp.evalCommand('P1=(x1_val,f(x1_val))');
                ggbApp.evalCommand('SetLabel(P1,"P1_extreme_point")');
    
                // x2 value (hidden)
                ggbApp.evalCommand('x2_val=NSolve(f(x)=0,x,x1_val+0.1,100)');
                ggbApp.evalCommand('SetVisibleInView(x2_val,1,false)');
                ggbApp.evalCommand('SetLabel(x2_val,"x2_root")');
    
                // Point P2 (visible)
                ggbApp.evalCommand('P2=(x2_val,0)');
                ggbApp.evalCommand('SetLabel(P2,"P2_zero_point")');
    
                // Helper function g_t (hidden)
                ggbApp.evalCommand('g_t(t)=f(x1_val+t)-f(x1_val-t)');
                ggbApp.evalCommand('SetVisibleInView(g_t,1,false)');
                ggbApp.evalCommand('SetLabel(g_t,"g_t_function")');
    
                // Update k value display
                updateKValue();
            }
    
            // UI Controls
            document.getElementById('toggleMainFunction').addEventListener('click', function() {
                const visible = ggbApp.getVisible('f', 1);
                ggbApp.setVisible('f', 1, !visible);
            });
    
            document.getElementById('toggleDerivative').addEventListener('click', function() {
                const visible = ggbApp.getVisible('f_prime', 1);
                ggbApp.setVisible('f_prime', 1, !visible);
            });
    
            document.getElementById('toggleP1').addEventListener('click', function() {
                const visible = ggbApp.getVisible('P1', 1);
                ggbApp.setVisible('P1', 1, !visible);
            });
    
            document.getElementById('toggleP2').addEventListener('click', function() {
                const visible = ggbApp.getVisible('P2', 1);
                ggbApp.setVisible('P2', 1, !visible);
            });
    
            document.getElementById('toggleGfunc').addEventListener('click', function() {
                const visible = ggbApp.getVisible('g_func', 1);
                ggbApp.setVisible('g_func', 1, !visible);
            });
    
            document.getElementById('toggleGt').addEventListener('click', function() {
                const visible = ggbApp.getVisible('g_t', 1);
                ggbApp.setVisible('g_t', 1, !visible);
            });
    
            document.getElementById('resetAll').addEventListener('click', function() {
                ggbApp.reset();
                initializeGeoGebra();
            });
    
            // Slider control for k
            const kSlider = document.getElementById('kSlider');
            kSlider.addEventListener('input', function() {
                const value = parseFloat(this.value).toFixed(2);
                ggbApp.evalCommand('SetValue(k,' + value + ')');
                updateKValue();
    
                // Update dependent objects
                ggbApp.evalCommand('UpdateConstruction()');
            });
    
            function updateKValue() {
                const kValue = ggbApp.getValue('k');
                document.getElementById('kValue').textContent = kValue.toFixed(2);
            }
    
            // Handle window resize
            window.addEventListener('resize', function() {
                if (typeof ggbApp !== 'undefined' && typeof ggbApp.recalculateEnvironments === 'function') {
                    ggbApp.setSize(800, 600);
                }
            });
        </script>
    </body>
    </html>`,
  
  // reset 方法 - 用新 HTML 字符串覆盖当前状态
  reset: (newHtml: string) => set({ htmlCode: newHtml }),
}));

export default useHtmlStore;
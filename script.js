function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// 导航栏激活状态
document.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// 初始化知识图谱 - 使用 vis-network
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('graph-container');
    if (!container) return;

    // 检查是否加载了 vis-network 库
    if (typeof vis === 'undefined') {
        // 动态加载 vis-network 库
        loadVisNetwork().then(initKnowledgeGraph).catch(showFallbackGraph);
    } else {
        initKnowledgeGraph();
    }

    function loadVisNetwork() {
        return new Promise((resolve, reject) => {
            // 加载 CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/vis-network/styles/vis-network.min.css';
            document.head.appendChild(link);

            // 加载 JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function initKnowledgeGraph() {
        // 创建节点数据 - 更丰富的节点
        const nodes = new vis.DataSet([
            // 中心节点
            { id: 1, label: "磁共振成像\n(MRI)", color: { background: "#4a90e2", border: "#357abd" }, font: { size: 20, color: "#ffffff" }, shape: "circle", size: 50 },
            
            // 主要分类
            { id: 2, label: "物理原理", color: { background: "#ff6b6b", border: "#e55a5a" }, font: { color: "#ffffff", size: 16 }, shape: "box", size: 35 },
            { id: 3, label: "成像序列", color: { background: "#6bcf7f", border: "#5ab86e" }, font: { color: "#ffffff", size: 16 }, shape: "box", size: 35 },
            { id: 4, label: "临床应用", color: { background: "#ffd166", border: "#e5bc5a" }, font: { color: "#333333", size: 16 }, shape: "box", size: 35 },
            { id: 5, label: "技术参数", color: { background: "#a367dc", border: "#8f5cc5" }, font: { color: "#ffffff", size: 16 }, shape: "box", size: 35 },
            { id: 6, label: "对比剂", color: { background: "#06d6a0", border: "#05c190" }, font: { color: "#ffffff", size: 16 }, shape: "box", size: 35 },
            { id: 7, label: "伪影", color: { background: "#ef476f", border: "#d63e63" }, font: { color: "#ffffff", size: 16 }, shape: "box", size: 35 },
            
            // 物理原理子节点
            { id: 8, label: "核磁共振", color: { background: "#ff9e7d", border: "#e58a6e" }, font: { color: "#333333" } },
            { id: 9, label: "弛豫时间", color: { background: "#7dcfff", border: "#6eb8e5" }, font: { color: "#333333" } },
            { id: 10, label: "磁场强度", color: { background: "#cba3ff", border: "#b68fe5" }, font: { color: "#333333" } },
            { id: 11, label: "拉莫尔频率", color: { background: "#a8e6cf", border: "#93cea8" }, font: { color: "#333333" } },
            { id: 12, label: "化学位移", color: { background: "#ffd3b6", border: "#e5bb9e" }, font: { color: "#333333" } },
            
            // 成像序列子节点
            { id: 13, label: "T1加权", color: { background: "#6bcf7f", border: "#5ab86e" }, font: { color: "#ffffff" } },
            { id: 14, label: "T2加权", color: { background: "#4ecdc4", border: "#43b4ac" }, font: { color: "#ffffff" } },
            { id: 15, label: "FLAIR", color: { background: "#45b7d1", border: "#3ca0b8" }, font: { color: "#ffffff" } },
            { id: 16, label: "DWI", color: { background: "#96ceb4", border: "#82b49e" }, font: { color: "#333333" } },
            { id: 17, label: "SWI", color: { background: "#feca57", border: "#e5b44d" }, font: { color: "#333333" } },
            { id: 18, label: "MRA", color: { background: "#ff9ff3", border: "#e58bd8" }, font: { color: "#333333" } },
            { id: 19, label: "MRV", color: { background: "#54a0ff", border: "#498ce5" }, font: { color: "#ffffff" } },
            { id: 20, label: "MRS", color: { background: "#5f27cd", border: "#5321b4" }, font: { color: "#ffffff" } },
            
            // 临床应用子节点
            { id: 21, label: "神经系统", color: { background: "#ff9f43", border: "#e58c3b" }, font: { color: "#333333" } },
            { id: 22, label: "心血管", color: { background: "#ee5253", border: "#d44849" }, font: { color: "#ffffff" } },
            { id: 23, label: "肌肉骨骼", color: { background: "#0abde3", border: "#09a7ca" }, font: { color: "#ffffff" } },
            { id: 24, label: "腹部成像", color: { background: "#10ac84", border: "#0e966f" }, font: { color: "#ffffff" } },
            { id: 25, label: "乳腺成像", color: { background: "#ff6b81", border: "#e55c73" }, font: { color: "#ffffff" } },
            
            // 技术参数子节点
            { id: 26, label: "TR/TE", color: { background: "#a367dc", border: "#8f5cc5" }, font: { color: "#ffffff" } },
            { id: 27, label: "翻转角", color: { background: "#5f27cd", border: "#5321b4" }, font: { color: "#ffffff" } },
            { id: 28, label: "矩阵大小", color: { background: "#c8d6e5", border: "#b0bfce" }, font: { color: "#333333" } },
            { id: 29, label: "层厚", color: { background: "#ff9ff3", border: "#e58bd8" }, font: { color: "#333333" } },
            { id: 30, label: "FOV", color: { background: "#f368e0", border: "#d95bc8" }, font: { color: "#ffffff" } },
            { id: 31, label: "NEX", color: { background: "#ff9f43", border: "#e58c3b" }, font: { color: "#333333" } },
            
            // 对比剂子节点
            { id: 32, label: "钆剂", color: { background: "#06d6a0", border: "#05c190" }, font: { color: "#ffffff" } },
            { id: 33, label: "超顺磁性\n氧化铁", color: { background: "#1dd1a1", border: "#1aba8f" }, font: { color: "#ffffff" } },
            { id: 34, label: "肝细胞特异性\n对比剂", color: { background: "#00d2d3", border: "#00b9ba" }, font: { color: "#ffffff" } },
            
            // 伪影子节点
            { id: 35, label: "运动伪影", color: { background: "#ef476f", border: "#d63e63" }, font: { color: "#ffffff" } },
            { id: 36, label: "磁化率伪影", color: { background: "#ff9a8b", border: "#e5877a" }, font: { color: "#333333" } },
            { id: 37, label: "化学位移\n伪影", color: { background: "#ff6b6b", border: "#e55a5a" }, font: { color: "#ffffff" } },
            { id: 38, label: "卷褶伪影", color: { background: "#ff9e7d", border: "#e58a6e" }, font: { color: "#333333" } }
        ]);

        // 创建边数据 - 更丰富的连接关系
        const edges = new vis.DataSet([
            // 从中心节点到主要分类
            { from: 1, to: 2, arrows: "to", color: { color: "#ff6b6b" }, width: 3 },
            { from: 1, to: 3, arrows: "to", color: { color: "#6bcf7f" }, width: 3 },
            { from: 1, to: 4, arrows: "to", color: { color: "#ffd166" }, width: 3 },
            { from: 1, to: 5, arrows: "to", color: { color: "#a367dc" }, width: 3 },
            { from: 1, to: 6, arrows: "to", color: { color: "#06d6a0" }, width: 3 },
            { from: 1, to: 7, arrows: "to", color: { color: "#ef476f" }, width: 3 },
            
            // 物理原理连接
            { from: 2, to: 8, arrows: "to", color: { color: "#ff9e7d" } },
            { from: 2, to: 9, arrows: "to", color: { color: "#7dcfff" } },
            { from: 2, to: 10, arrows: "to", color: { color: "#cba3ff" } },
            { from: 2, to: 11, arrows: "to", color: { color: "#a8e6cf" } },
            { from: 2, to: 12, arrows: "to", color: { color: "#ffd3b6" } },
            
            // 成像序列连接
            { from: 3, to: 13, arrows: "to", color: { color: "#6bcf7f" } },
            { from: 3, to: 14, arrows: "to", color: { color: "#4ecdc4" } },
            { from: 3, to: 15, arrows: "to", color: { color: "#45b7d1" } },
            { from: 3, to: 16, arrows: "to", color: { color: "#96ceb4" } },
            { from: 3, to: 17, arrows: "to", color: { color: "#feca57" } },
            { from: 3, to: 18, arrows: "to", color: { color: "#ff9ff3" } },
            { from: 3, to: 19, arrows: "to", color: { color: "#54a0ff" } },
            { from: 3, to: 20, arrows: "to", color: { color: "#5f27cd" } },
            
            // 临床应用连接
            { from: 4, to: 21, arrows: "to", color: { color: "#ff9f43" } },
            { from: 4, to: 22, arrows: "to", color: { color: "#ee5253" } },
            { from: 4, to: 23, arrows: "to", color: { color: "#0abde3" } },
            { from: 4, to: 24, arrows: "to", color: { color: "#10ac84" } },
            { from: 4, to: 25, arrows: "to", color: { color: "#ff6b81" } },
            
            // 技术参数连接
            { from: 5, to: 26, arrows: "to", color: { color: "#a367dc" } },
            { from: 5, to: 27, arrows: "to", color: { color: "#5f27cd" } },
            { from: 5, to: 28, arrows: "to", color: { color: "#c8d6e5" } },
            { from: 5, to: 29, arrows: "to", color: { color: "#ff9ff3" } },
            { from: 5, to: 30, arrows: "to", color: { color: "#f368e0" } },
            { from: 5, to: 31, arrows: "to", color: { color: "#ff9f43" } },
            
            // 对比剂连接
            { from: 6, to: 32, arrows: "to", color: { color: "#06d6a0" } },
            { from: 6, to: 33, arrows: "to", color: { color: "#1dd1a1" } },
            { from: 6, to: 34, arrows: "to", color: { color: "#00d2d3" } },
            
            // 伪影连接
            { from: 7, to: 35, arrows: "to", color: { color: "#ef476f" } },
            { from: 7, to: 36, arrows: "to", color: { color: "#ff9a8b" } },
            { from: 7, to: 37, arrows: "to", color: { color: "#ff6b6b" } },
            { from: 7, to: 38, arrows: "to", color: { color: "#ff9e7d" } }
        ]);

        // 创建图谱数据
        const data = {
            nodes: nodes,
            edges: edges
        };

        // 配置选项
        const options = {
            layout: {
                improvedLayout: true,
                hierarchical: {
                    enabled: true,
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 180,
                    nodeSpacing: 150
                }
            },
            physics: {
                enabled: true,
                hierarchicalRepulsion: {
                    centralGravity: 0.0,
                    springLength: 220,
                    springConstant: 0.01,
                    nodeDistance: 150,
                    damping: 0.09
                },
                stabilization: { 
                    iterations: 1000,
                    fit: true
                }
            },
            interaction: {
                dragNodes: true,
                dragView: true,
                zoomView: true,
                hover: true,
                hoverConnectedEdges: true
            },
            nodes: {
                shape: 'dot',
                size: 25,
                font: {
                    size: 14,
                    face: 'Inter, sans-serif',
                    strokeWidth: 2,
                    strokeColor: 'rgba(255,255,255,0.8)'
                },
                borderWidth: 2,
                shadow: {
                    enabled: true,
                    color: 'rgba(0,0,0,0.3)',
                    size: 10,
                    x: 5,
                    y: 5
                }
            },
            edges: {
                width: 2,
                color: {
                    color: 'rgba(74, 144, 226, 0.7)',
                    highlight: '#4a90e2',
                    hover: '#4a90e2'
                },
                smooth: {
                    enabled: true,
                    type: 'continuous'
                },
                shadow: {
                    enabled: true,
                    color: 'rgba(0,0,0,0.2)',
                    size: 5,
                    x: 3,
                    y: 3
                }
            },
            height: '100%',
            width: '100%'
        };

        // 渲染知识图谱
        try {
            const network = new vis.Network(container, data, options);

            // 节点信息映射
            const nodeInfoMap = {
                1: { title: "磁共振成像 (MRI)", description: "利用原子核在磁场中的共振现象，通过射频脉冲激发和接收信号来生成人体内部结构图像的无创医学成像技术。" },
                2: { title: "物理原理", description: "磁共振成像的基础物理学原理，包括核磁共振现象、弛豫过程等。" },
                3: { title: "成像序列", description: "不同的射频脉冲序列和梯度磁场组合，用于获取不同类型的组织对比度。" },
                4: { title: "临床应用", description: "MRI在不同医学专科和疾病诊断中的应用领域。" },
                5: { title: "技术参数", description: "影响图像质量和采集时间的关键扫描参数。" },
                6: { title: "对比剂", description: "用于增强组织对比度的药物，帮助提高病变的检出率。" },
                7: { title: "伪影", description: "图像中出现的非真实解剖结构的干扰信号。" },
                8: { title: "核磁共振", description: "原子核在静磁场中吸收特定频率的射频能量发生能级跃迁的现象。" },
                9: { title: "弛豫时间", description: "核自旋系统从激发状态恢复到平衡状态所需的时间，包括T1和T2弛豫。" },
                10: { title: "磁场强度", description: "主磁场的强度，通常以特斯拉(T)为单位，影响信噪比和化学位移。" },
                11: { title: "拉莫尔频率", description: "原子核在特定磁场强度下发生共振的特定频率。" },
                12: { title: "化学位移", description: "由于化学环境不同导致的共振频率微小差异。" },
                13: { title: "T1加权", description: "主要反映组织的T1弛豫特性，适合观察解剖结构。" },
                14: { title: "T2加权", description: "主要反映组织的T2弛豫特性，对病变和水肿敏感。" },
                15: { title: "FLAIR", description: "液体衰减反转恢复序列，抑制脑脊液信号，提高病变显示。" },
                16: { title: "DWI", description: "扩散加权成像，反映水分子的布朗运动，对急性脑梗死敏感。" },
                17: { title: "SWI", description: "磁敏感加权成像，对静脉血、出血和铁沉积敏感。" },
                18: { title: "MRA", description: "磁共振血管成像，无创显示动脉系统。" },
                19: { title: "MRV", description: "磁共振静脉成像，显示静脉系统。" },
                20: { title: "MRS", description: "磁共振波谱，分析组织代谢产物。" },
                21: { title: "神经系统", description: "脑、脊髓和周围神经的MRI检查。" },
                22: { title: "心血管", description: "心脏和大血管的MRI检查。" },
                23: { title: "肌肉骨骼", description: "关节、肌肉和骨骼的MRI检查。" },
                24: { title: "腹部成像", description: "肝、胆、胰、脾、肾等腹部脏器的MRI检查。" },
                25: { title: "乳腺成像", description: "乳腺组织的专用MRI检查。" },
                26: { title: "TR/TE", description: "重复时间/回波时间，影响图像权重和对比度。" },
                27: { title: "翻转角", description: "射频脉冲使磁化矢量翻转的角度，影响信号强度。" },
                28: { title: "矩阵大小", description: "图像的空间分辨率参数。" },
                29: { title: "层厚", description: "扫描层面的厚度，影响空间分辨率和信噪比。" },
                30: { title: "FOV", description: "视野，扫描区域的大小。" },
                31: { title: "NEX", description: "激励次数，影响信噪比和扫描时间。" },
                32: { title: "钆剂", description: "最常用的MRI对比剂，缩短T1弛豫时间。" },
                33: { title: "超顺磁性氧化铁", description: "网状内皮系统特异性对比剂。" },
                34: { title: "肝细胞特异性对比剂", description: "肝细胞特异性摄取的对比剂。" },
                35: { title: "运动伪影", description: "由患者运动引起的图像模糊或重影。" },
                36: { title: "磁化率伪影", description: "组织间磁化率差异导致的信号失真。" },
                37: { title: "化学位移伪影", description: "水和脂肪中质子共振频率差异导致的错位伪影。" },
                38: { title: "卷褶伪影", description: "扫描视野小于解剖结构时出现的图像折叠。" }
            };

            // 添加节点点击事件
            network.on("click", function(params) {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    const node = nodes.get(nodeId);
                    const info = nodeInfoMap[nodeId];
                    
                    // 显示节点信息
                    const infoDiv = document.getElementById('node-info') || createNodeInfoDiv();
                    infoDiv.innerHTML = `
                        <h4>${info.title}</h4>
                        <p>${info.description}</p>
                        <button onclick="this.parentElement.style.display='none'">关闭</button>
                    `;
                    infoDiv.style.display = 'block';
                }
            });

            // 添加悬停效果
            network.on("hoverNode", function(params) {
                container.style.cursor = 'pointer';
            });

            network.on("blurNode", function(params) {
                container.style.cursor = 'default';
            });

        } catch (error) {
            console.error('知识图谱初始化失败:', error);
            showFallbackGraph();
        }
    }

    function createNodeInfoDiv() {
        const infoDiv = document.createElement('div');
        infoDiv.id = 'node-info';
        infoDiv.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.98);
            color: #333;
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #4a90e2;
            max-width: 350px;
            display: none;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
        `;
        container.appendChild(infoDiv);
        return infoDiv;
    }

    function showFallbackGraph() {
        // 备用方案：SVG 知识图谱
        container.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
                <svg width="100%" height="100%" viewBox="0 0 1000 600" style="background: rgba(255,255,255,0.9); border-radius: 12px;">
                    <!-- 连接线 -->
                    <line x1="500" y1="100" x2="350" y2="200" stroke="#4a90e2" stroke-width="3"/>
                    <line x1="500" y1="100" x2="500" y2="200" stroke="#6bcf7f" stroke-width="3"/>
                    <line x1="500" y1="100" x2="650" y2="200" stroke="#ffd166" stroke-width="3"/>
                    
                    <!-- 中心节点 -->
                    <circle cx="500" cy="100" r="50" fill="#4a90e2" stroke="#fff" stroke-width="3" filter="url(#glow)"/>
                    <text x="500" y="105" text-anchor="middle" fill="#fff" font-weight="bold" font-size="16">MRI</text>
                    
                    <!-- 二级节点 -->
                    <circle cx="350" cy="200" r="35" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
                    <text x="350" y="205" text-anchor="middle" fill="#fff" font-size="12">物理原理</text>
                    
                    <circle cx="500" cy="200" r="35" fill="#6bcf7f" stroke="#fff" stroke-width="2"/>
                    <text x="500" y="205" text-anchor="middle" fill="#fff" font-size="12">成像序列</text>
                    
                    <circle cx="650" cy="200" r="35" fill="#ffd166" stroke="#fff" stroke-width="2"/>
                    <text x="650" y="205" text-anchor="middle" fill="#333" font-size="12">临床应用</text>
                    
                    <!-- 三级节点 -->
                    <circle cx="250" cy="300" r="25" fill="#ff9e7d" stroke="#fff" stroke-width="2"/>
                    <text x="250" y="305" text-anchor="middle" fill="#333" font-size="10">核磁共振</text>
                    
                    <circle cx="350" cy="300" r="25" fill="#7dcfff" stroke="#fff" stroke-width="2"/>
                    <text x="350" y="305" text-anchor="middle" fill="#333" font-size="10">弛豫时间</text>
                    
                    <circle cx="450" cy="300" r="25" fill="#6bcf7f" stroke="#fff" stroke-width="2"/>
                    <text x="450" y="305" text-anchor="middle" fill="#fff" font-size="10">T1加权</text>
                    
                    <circle cx="550" cy="300" r="25" fill="#4ecdc4" stroke="#fff" stroke-width="2"/>
                    <text x="550" y="305" text-anchor="middle" fill="#fff" font-size="10">T2加权</text>
                    
                    <circle cx="650" cy="300" r="25" fill="#ff9f43" stroke="#fff" stroke-width="2"/>
                    <text x="650" y="305" text-anchor="middle" fill="#333" font-size="10">神经系统</text>
                    
                    <circle cx="750" cy="300" r="25" fill="#ee5253" stroke="#fff" stroke-width="2"/>
                    <text x="750" y="305" text-anchor="middle" fill="#fff" font-size="10">心血管</text>
                    
                    <defs>
                        <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow"/>
                            <feComposite in="SourceGraphic" in2="glow" operator="over"/>
                        </filter>
                    </defs>
                </svg>
                <div style="position: absolute; top: 10px; left: 10px; color: #4a90e2; background: rgba(255,255,255,0.9); padding: 15px; border-radius: 8px; border: 1px solid #4a90e2; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <p style="margin: 0 0 8px 0; font-weight: bold;">🔍 交互式知识图谱</p>
                    <p style="margin: 0 0 8px 0; font-size: 0.9rem;">点击节点查看详细信息</p>
                    <p style="margin: 0; font-size: 0.9rem;">🔄 拖拽和缩放探索图谱</p>
                </div>
            </div>
        `;
    }
});

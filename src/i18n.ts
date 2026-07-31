type Locale = "en" | "es" | "zh";
type Translation = { es: string; zh: string };

const copy: Record<string, Translation> = {
  "Alejandro Lozano — Technical Product Manager": { es: "Alejandro Lozano — Product Manager técnico", zh: "Alejandro Lozano — 技术型产品经理" },
  "Skip to content": { es: "Saltar al contenido", zh: "跳到主要内容" },
  "Thesis": { es: "Tesis", zh: "核心观点" },
  "Selected work": { es: "Trabajo seleccionado", zh: "代表工作" },
  "Capabilities": { es: "Capacidades", zh: "核心能力" },
  "Build log": { es: "Proyectos", zh: "构建记录" },
  "About": { es: "Perfil", zh: "关于我" },
  "Work": { es: "Trabajo", zh: "工作" },
  "Language": { es: "Idioma", zh: "语言" },
  "Let’s talk": { es: "Hablemos", zh: "联系我" },
  "Product Manager · Technical background": { es: "Product Manager · Background técnico", zh: "产品经理 · 技术背景" },
  "Product thinking,": { es: "Pensamiento de producto,", zh: "产品思维，" },
  "grounded in systems.": { es: "basado en sistemas.", zh: "建立在系统之上。" },
  "I connect business, technology and data to move complex products forward.": { es: "Conecto negocio, tecnología y datos para hacer avanzar productos complejos.", zh: "我连接业务、技术与数据，推动复杂产品持续向前。" },
  "01 · Thesis": { es: "01 · Tesis", zh: "01 · 核心观点" },
  "The roadmap is only as credible as the system beneath it.": { es: "Un roadmap solo es creíble si también lo es el sistema que lo sostiene.", zh: "产品路线图的可信度，取决于其底层系统。" },
  "I trained as a computer engineer and spent two years building regulated data pipelines for banking risk teams. That work showed me where product promises meet data quality, controls and delivery constraints.": { es: "Me formé como ingeniero informático y pasé dos años construyendo pipelines regulados para equipos de riesgo bancario. Allí aprendí dónde las promesas de producto se encuentran con la calidad, los controles y las restricciones de entrega.", zh: "我接受了计算机工程训练，并用两年时间为银行风险团队构建受监管的数据管道。这段经历让我看清，产品承诺如何落到数据质量、控制机制与交付约束上。" },
  "I now work upstream in life insurance, shaping backlog and delivery decisions.": { es: "Ahora trabajo aguas arriba en seguros de vida, definiendo el backlog y las decisiones de entrega.", zh: "如今，我在寿险产品的上游工作，参与塑造待办事项与交付决策。" },
  "The move was deliberate: I wanted to decide what gets built with a clear view of what the system can actually support.": { es: "El cambio fue deliberado: quería decidir qué construir entendiendo con claridad qué puede sostener realmente el sistema.", zh: "这次转型是主动选择：我希望在真正理解系统承载能力的前提下，决定应该构建什么。" },
  "Engineering": { es: "Ingeniería", zh: "工程" },
  "Computer engineering foundations: software, systems and data structures.": { es: "Fundamentos de ingeniería informática: software, sistemas y estructuras de datos.", zh: "计算机工程基础：软件、系统与数据结构。" },
  "Data": { es: "Datos", zh: "数据" },
  "Regulated banking pipelines, risk reporting and decision-ready BI.": { es: "Pipelines bancarios regulados, reporting de riesgo y BI orientado a decisiones.", zh: "受监管的银行数据管道、风险报告与决策型 BI。" },
  "2025—Now": { es: "2025—Actualidad", zh: "2025—至今" },
  "Product": { es: "Producto", zh: "产品" },
  "Backlog and delivery decisions for life-insurance products.": { es: "Backlog y decisiones de entrega para productos de seguros de vida.", zh: "寿险产品的待办事项与交付决策。" },
  "Current focus": { es: "Foco actual", zh: "当前方向" },
  "02 · Selected work": { es: "02 · Trabajo seleccionado", zh: "02 · 代表工作" },
  "Three problems. One operating pattern.": { es: "Tres problemas. Una forma de operar.", zh: "三个问题。一套工作方法。" },
  "BI · Decision layer": { es: "BI · Capa de decisión", zh: "BI · 决策层" },
  "From 100+ reports to one governed view.": { es: "De más de 100 informes a una visión gobernada.", zh: "从 100 多份报告，到一个统一治理视图。" },
  "Fragmented recurring risk reporting rebuilt as six Power BI dashboards on one data model.": { es: "Reporting de riesgo fragmentado, reconstruido como seis dashboards de Power BI sobre un único modelo de datos.", zh: "将分散的周期性风险报告，重构为基于统一数据模型的六个 Power BI 仪表板。" },
  "reporting workload": { es: "carga de reporting", zh: "报告工作量" },
  "Context": { es: "Contexto", zh: "背景" },
  "More than 100 recurring reports created duplicated work and inconsistent views.": { es: "Más de 100 informes recurrentes generaban trabajo duplicado y visiones inconsistentes.", zh: "100 多份周期性报告造成重复劳动与口径不一致。" },
  "My role": { es: "Mi rol", zh: "我的角色" },
  "I owned requirements, data modelling, ETL and production dashboards.": { es: "Lideré requisitos, modelado de datos, ETL y dashboards en producción.", zh: "我负责需求、数据建模、ETL 与生产仪表板的端到端交付。" },
  "Decision": { es: "Decisión", zh: "关键决策" },
  "Consolidate repeated logic into one model and six recurring decision views.": { es: "Consolidar la lógica repetida en un modelo y seis vistas recurrentes de decisión.", zh: "将重复逻辑整合为一个模型和六个周期性决策视图。" },
  "Regulatory · COREP": { es: "Regulación · COREP", zh: "监管 · COREP" },
  "Regulatory reporting without recurring manual load.": { es: "Reporting regulatorio sin carga manual recurrente.", zh: "消除周期性人工负担的监管报告。" },
  "COREP (European regulatory capital reporting) moved from manual assembly to controlled SAS and SQL pipelines.": { es: "COREP (reporting europeo de capital regulatorio) pasó del montaje manual a pipelines controlados en SAS y SQL.", zh: "COREP（欧洲监管资本报告）从人工汇总转为受控的 SAS 与 SQL 数据管道。" },
  "efficiency gain": { es: "mejora de eficiencia", zh: "效率提升" },
  "100 runtime": { es: "100 ejecución", zh: "100 运行时长" },
  "Before optimisation": { es: "Antes de optimizar", zh: "优化前" },
  "Controlled SAS / SQL pipeline": { es: "Pipeline SAS / SQL controlado", zh: "受控 SAS / SQL 管道" },
  ">50% faster": { es: ">50% más rápido", zh: "提速 >50%" },
  "from source data to validated regulatory output": { es: "desde el dato de origen hasta la salida regulatoria validada", zh: "从源数据到已验证的监管输出" },
  "A G-SIB needed repeatable capital reporting that could withstand supervisory review.": { es: "Un banco de importancia sistémica global necesitaba reporting de capital repetible y preparado para revisión supervisora.", zh: "一家全球系统重要性银行需要可重复执行、经得起监管审查的资本报告。" },
  "I designed and optimised critical data pipelines for credit-risk portfolios.": { es: "Diseñé y optimicé pipelines críticos para carteras de riesgo de crédito.", zh: "我为信用风险组合设计并优化了关键数据管道。" },
  "Move validation, reconciliation and controls for RWA, CET1 and provisions into the pipeline.": { es: "Integrar en el pipeline la validación, conciliación y controles de RWA, CET1 y provisiones.", zh: "将 RWA、CET1 与拨备的验证、对账及质量控制纳入管道。" },
  "Life insurance · Product delivery": { es: "Seguros de vida · Entrega de producto", zh: "寿险 · 产品交付" },
  "Turning product change into release-ready work.": { es: "Convertir el cambio de producto en trabajo listo para lanzar.", zh: "把产品变更转化为可发布的工作。" },
  "Life-insurance initiatives structured into a shared backlog across business, technology, operations and compliance.": { es: "Iniciativas de seguros de vida estructuradas en un backlog compartido entre negocio, tecnología, operaciones y cumplimiento.", zh: "将寿险举措整理为业务、技术、运营与合规共同使用的产品待办事项。" },
  "One view": { es: "Una visión", zh: "一个视图" },
  "for release decisions": { es: "para decisiones de lanzamiento", zh: "支持发布决策" },
  "Release decision": { es: "Decisión de lanzamiento", zh: "发布决策" },
  "Business": { es: "Negocio", zh: "业务" },
  "Technology": { es: "Tecnología", zh: "技术" },
  "Operations": { es: "Operaciones", zh: "运营" },
  "Compliance": { es: "Cumplimiento", zh: "合规" },
  "One backlog turns four specialist perspectives into release-ready work.": { es: "Un backlog convierte cuatro perspectivas especializadas en trabajo listo para lanzar.", zh: "一个待办事项列表，将四类专业视角转化为可发布的工作。" },
  "Product changes crossed business, technology, operations and compliance.": { es: "Los cambios de producto atravesaban negocio, tecnología, operaciones y cumplimiento.", zh: "产品变更横跨业务、技术、运营与合规。" },
  "I shape backlog priorities, acceptance criteria and delivery controls.": { es: "Defino prioridades del backlog, criterios de aceptación y controles de entrega.", zh: "我负责确定待办优先级、验收标准与交付控制。" },
  "Connect user stories, acceptance criteria, UAT evidence and milestones in one delivery view.": { es: "Conectar historias de usuario, criterios de aceptación, evidencias UAT e hitos en una única visión de entrega.", zh: "将用户故事、验收标准、UAT 证据与里程碑连接到统一交付视图。" },
  "03 · Capabilities": { es: "03 · Capacidades", zh: "03 · 核心能力" },
  "Built for the space between a roadmap and its data.": { es: "Preparado para el espacio entre un roadmap y sus datos.", zh: "专注于路线图与底层数据之间的关键空间。" },
  "Own the decision": { es: "Liderar la decisión", zh: "掌控决策" },
  "Product & Delivery": { es: "Producto y entrega", zh: "产品与交付" },
  "Product backlog": { es: "Backlog de producto", zh: "产品待办事项" },
  "User stories & acceptance criteria": { es: "Historias de usuario y criterios de aceptación", zh: "用户故事与验收标准" },
  "Roadmap management": { es: "Gestión de roadmap", zh: "路线图管理" },
  "Stakeholder management": { es: "Gestión de stakeholders", zh: "利益相关方管理" },
  "Read the system": { es: "Leer el sistema", zh: "读懂系统" },
  "Data & BI": { es: "Datos y BI", zh: "数据与 BI" },
  "ETL design": { es: "Diseño ETL", zh: "ETL 设计" },
  "Data modelling": { es: "Modelado de datos", zh: "数据建模" },
  "KPI design": { es: "Diseño de KPI", zh: "KPI 设计" },
  "Understand the stakes": { es: "Entender lo que está en juego", zh: "理解业务影响" },
  "Regulated domains": { es: "Dominios regulados", zh: "受监管领域" },
  "Credit risk": { es: "Riesgo de crédito", zh: "信用风险" },
  "Life insurance": { es: "Seguros de vida", zh: "寿险" },
  "Underwriting": { es: "Suscripción", zh: "核保" },
  "Regulatory reporting (COREP)": { es: "Reporting regulatorio (COREP)", zh: "监管报告（COREP）" },
  "Working tools · Jira · Confluence · Excel · PowerPoint": { es: "Herramientas · Jira · Confluence · Excel · PowerPoint", zh: "工作工具 · Jira · Confluence · Excel · PowerPoint" },
  "04 · Build log": { es: "04 · Proyectos", zh: "04 · 构建记录" },
  "Products I designed, coded and deployed.": { es: "Productos que diseñé, programé y publiqué.", zh: "由我设计、编码并部署的产品。" },
  "01 · Data product": { es: "01 · Producto de datos", zh: "01 · 数据产品" },
  "A Power BI concept rebuilt as a responsive web product for indicators, time series and multi-country comparison.": { es: "Un concepto de Power BI reconstruido como producto web responsive para indicadores, series temporales y comparación entre países.", zh: "将 Power BI 概念重构为响应式 Web 产品，用于指标、时间序列与多国对比。" },
  "Live": { es: "En vivo", zh: "在线" },
  "Full screen": { es: "Pantalla completa", zh: "全屏" },
  "Exit full screen": { es: "Salir de pantalla completa", zh: "退出全屏" },
  "Open in a new tab": { es: "Abrir en una pestaña nueva", zh: "在新标签页中打开" },
  "Dashboard ready to load.": { es: "Dashboard listo para cargar.", zh: "仪表板已准备加载。" },
  "Connecting to the live product…": { es: "Conectando con el producto en vivo…", zh: "正在连接在线产品…" },
  "A static capture is shown. Use the link above to open the live dashboard.": { es: "Se muestra una captura estática. Usa el enlace superior para abrir el dashboard en vivo.", zh: "当前显示静态预览。请使用上方链接打开在线仪表板。" },
  "Macroeconomic Dashboard · Jun 2025": { es: "Macroeconomic Dashboard · Jun 2025", zh: "宏观经济仪表板 · 2025年6月" },
  "02 · AI product": { es: "02 · Producto de IA", zh: "02 · AI 产品" },
  "A guided product that turns business context into a prioritised AI opportunity roadmap, with value and feasibility considered before investment.": { es: "Un producto guiado que convierte el contexto de negocio en un roadmap priorizado de oportunidades de IA, evaluando valor y viabilidad antes de invertir.", zh: "一个引导式产品，将业务背景转化为 AI 机会优先级路线图，并在投入前评估价值与可行性。" },
  "Explore": { es: "Explorar", zh: "探索" },
  "Resume preview": { es: "Reanudar vista previa", zh: "恢复预览" },
  "AdoptAI ready to load.": { es: "AdoptAI listo para cargar.", zh: "AdoptAI 已准备加载。" },
  "A static capture is shown. Use the link above to open AdoptAI.": { es: "Se muestra una captura estática. Usa el enlace superior para abrir AdoptAI.", zh: "当前显示静态预览。请使用上方链接打开 AdoptAI。" },
  "AdoptAI · AI opportunity intelligence": { es: "AdoptAI · Inteligencia de oportunidades de IA", zh: "AdoptAI · AI 机会洞察" },
  "Product strategy · UX · Web delivery": { es: "Estrategia de producto · UX · Entrega web", zh: "产品策略 · UX · Web 交付" },
  "05 · About": { es: "05 · Perfil", zh: "05 · 关于我" },
  "Next: products where constraints shape the roadmap.": { es: "Siguiente: productos donde las restricciones dan forma al roadmap.", zh: "下一步：让真实约束塑造产品路线图。" },
  "Based in Barcelona and trained in computer engineering. I want to work on regulated or data-intensive products where choices depend on real technical constraints.": { es: "Vivo en Barcelona y soy ingeniero informático. Busco productos regulados o intensivos en datos, donde las decisiones dependan de restricciones técnicas reales.", zh: "我常驻巴塞罗那，拥有计算机工程背景。我希望参与受监管或数据密集型产品，让决策建立在真实技术约束之上。" },
  "Education": { es: "Formación", zh: "教育背景" },
  "MSc Business Consulting, Data Science": { es: "Máster en Consultoría de Negocio, Data Science", zh: "商业咨询硕士，数据科学方向" },
  "BSc Computer Engineering": { es: "Grado en Ingeniería Informática", zh: "计算机工程学士" },
  "Certifications": { es: "Certificaciones", zh: "认证" },
  "Generative AI with Large Language Models": { es: "IA generativa con modelos de lenguaje", zh: "基于大语言模型的生成式 AI" },
  "Python 101 + Data Analysis with Python": { es: "Python 101 + Análisis de datos con Python", zh: "Python 101 + Python 数据分析" },
  "Languages": { es: "Idiomas", zh: "语言" },
  "Spanish + Catalan": { es: "Español + Catalán", zh: "西班牙语 + 加泰罗尼亚语" },
  "Native": { es: "Nativo", zh: "母语" },
  "English": { es: "Inglés", zh: "英语" },
  "Professional · Mandarin: Beginner": { es: "Profesional · Mandarín: principiante", zh: "专业工作水平 · 普通话：初学" },
  "Let’s discuss the product problem behind the roadmap.": { es: "Hablemos del problema de producto que hay detrás del roadmap.", zh: "聊聊路线图背后的产品问题。" },
  "Email": { es: "Email", zh: "邮箱" },
  "Download CV": { es: "Descargar CV", zh: "下载简历" },
  "Back to top": { es: "Volver arriba", zh: "返回顶部" },
  "Alejandro Lozano · Barcelona": { es: "Alejandro Lozano · Barcelona", zh: "Alejandro Lozano · 巴塞罗那" },

  "Portfolio sections": { es: "Secciones del portfolio", zh: "作品集章节" },
  "Alejandro Lozano, home": { es: "Alejandro Lozano, inicio", zh: "Alejandro Lozano，首页" },
  "Primary navigation": { es: "Navegación principal", zh: "主导航" },
  "Continue to the thesis": { es: "Continuar a la tesis", zh: "继续阅读核心观点" },
  "Career progression from engineering to product": { es: "Evolución profesional de ingeniería a producto", zh: "从工程到产品的职业路径" },
  "SAS pipeline runtime reduced by more than 50 percent": { es: "Tiempo de ejecución del pipeline SAS reducido más de un 50 por ciento", zh: "SAS 管道运行时长减少超过 50%" },
  "Product management connecting business, technology, operations and compliance": { es: "Gestión de producto conectando negocio, tecnología, operaciones y cumplimiento", zh: "连接业务、技术、运营与合规的产品管理" },
  "Live preview of the Macroeconomic Dashboard": { es: "Vista en vivo del Macroeconomic Dashboard", zh: "宏观经济仪表板在线预览" },
  "Alejandro Lozano’s live Macroeconomic Dashboard": { es: "Macroeconomic Dashboard en vivo de Alejandro Lozano", zh: "Alejandro Lozano 的在线宏观经济仪表板" },
  "Dashboard controls": { es: "Controles del dashboard", zh: "仪表板控制" },
  "The live Macroeconomic Dashboard showing 2025 GDP growth, country rankings and a world map.": { es: "Macroeconomic Dashboard mostrando crecimiento del PIB de 2025, rankings de países y un mapa mundial.", zh: "宏观经济仪表板，展示 2025 年 GDP 增长、国家排名与世界地图。" },
  "Live preview of AdoptAI": { es: "Vista en vivo de AdoptAI", zh: "AdoptAI 在线预览" },
  "AdoptAI live product": { es: "Producto AdoptAI en vivo", zh: "AdoptAI 在线产品" },
  "AdoptAI controls": { es: "Controles de AdoptAI", zh: "AdoptAI 控制" },
  "AdoptAI presenting a guided assessment for prioritising business AI opportunities.": { es: "AdoptAI mostrando una evaluación guiada para priorizar oportunidades empresariales de IA.", zh: "AdoptAI 展示用于确定企业 AI 机会优先级的引导式评估。" },
  "Return to the top of the portfolio": { es: "Volver al inicio del portfolio", zh: "返回作品集顶部" },
  "Footer links": { es: "Enlaces del pie de página", zh: "页脚链接" },

  "Technical Product Manager Alejandro Lozano combines product delivery in life insurance with hands-on data engineering across banking risk, BI and regulatory pipelines.": { es: "Alejandro Lozano es Product Manager técnico y combina entrega de producto en seguros de vida con experiencia práctica en ingeniería de datos, riesgo bancario, BI y pipelines regulatorios.", zh: "技术型产品经理 Alejandro Lozano，结合寿险产品交付与银行风险、BI 及监管数据管道的一线工程经验。" },
  "I make product decisions with a clear view of the systems and data beneath them.": { es: "Tomo decisiones de producto entendiendo los sistemas y datos que las sostienen.", zh: "我在充分理解底层系统与数据的基础上做产品决策。" },
  "Alejandro Lozano, Technical Product Manager, Product Owner, Banking Product Manager, Insurance Product Manager, Data Product Manager, Power BI, SQL, SAS, Barcelona": { es: "Alejandro Lozano, Product Manager técnico, Product Owner, Product Manager banca, Product Manager seguros, producto de datos, Power BI, SQL, SAS, Barcelona", zh: "Alejandro Lozano, 技术型产品经理, 产品负责人, 银行产品经理, 保险产品经理, 数据产品经理, Power BI, SQL, SAS, 巴塞罗那" },

  "Static dashboard preview shown. A direct link is available.": { es: "Se muestra una vista estática del dashboard. Hay un enlace directo disponible.", zh: "当前显示仪表板静态预览，并提供直接链接。" },
  "Live dashboard loaded.": { es: "Dashboard en vivo cargado.", zh: "在线仪表板已加载。" },
  "Connecting to the live dashboard…": { es: "Conectando con el dashboard en vivo…", zh: "正在连接在线仪表板…" },
  "The live product could not be embedded here.": { es: "No se pudo incrustar aquí el producto en vivo.", zh: "无法在此嵌入在线产品。" },
  "The live product is taking longer than expected.": { es: "El producto en vivo tarda más de lo esperado.", zh: "在线产品加载时间超出预期。" },
  "A static capture is shown. The live dashboard opens in a new tab on smaller screens.": { es: "Se muestra una captura estática. En pantallas pequeñas, el dashboard se abre en una pestaña nueva.", zh: "当前显示静态预览。在小屏幕上，在线仪表板将在新标签页中打开。" },
  "Static dashboard preview shown for this screen size.": { es: "Se muestra una vista estática del dashboard para este tamaño de pantalla.", zh: "当前屏幕尺寸显示仪表板静态预览。" },
  "Full-screen mode is unavailable in this browser.": { es: "El modo de pantalla completa no está disponible en este navegador.", zh: "此浏览器不支持全屏模式。" },
  "Live AdoptAI product loaded. The page preview scrolls automatically.": { es: "AdoptAI en vivo cargado. La vista previa se desplaza automáticamente.", zh: "AdoptAI 在线产品已加载，页面预览将自动滚动。" },
  "Interactive AdoptAI mode enabled. The automatic preview is paused.": { es: "Modo interactivo de AdoptAI activado. La vista automática está pausada.", zh: "AdoptAI 交互模式已启用，自动预览已暂停。" },
  "Automatic AdoptAI preview resumed.": { es: "Vista automática de AdoptAI reanudada.", zh: "AdoptAI 自动预览已恢复。" },
  "Static AdoptAI preview shown. A direct link is available.": { es: "Se muestra una vista estática de AdoptAI. Hay un enlace directo disponible.", zh: "当前显示 AdoptAI 静态预览，并提供直接链接。" },
  "Connecting to AdoptAI…": { es: "Conectando con AdoptAI…", zh: "正在连接 AdoptAI…" },
  "AdoptAI could not be embedded here. Use the direct link above.": { es: "No se pudo incrustar AdoptAI. Usa el enlace directo superior.", zh: "无法在此嵌入 AdoptAI，请使用上方直接链接。" },
  "AdoptAI is taking longer than expected. Use the direct link above.": { es: "AdoptAI tarda más de lo esperado. Usa el enlace directo superior.", zh: "AdoptAI 加载时间超出预期，请使用上方直接链接。" },
  "A static capture is shown. AdoptAI opens in a new tab on this screen.": { es: "Se muestra una captura estática. En esta pantalla, AdoptAI se abre en una pestaña nueva.", zh: "当前显示静态预览。在此屏幕上，AdoptAI 将在新标签页中打开。" },
};

const normalise = (value: string) => value.replace(/\s+/g, " ").trim();

export const initI18n = () => {
  const selector = document.querySelector<HTMLSelectElement>("[data-language-switcher]");
  if (!selector) return;

  const textBindings: Array<{ node: Text; key: string; leading: boolean; trailing: boolean }> = [];
  const attributeBindings: Array<{ element: Element; name: string; key: string }> = [];
  const knownTextNodes = new WeakSet<Text>();
  const knownAttributes = new WeakMap<Element, Set<string>>();
  const translatableAttributes = ["aria-label", "title", "alt", "data-project-title"];
  let locale: Locale = "en";

  try {
    const stored = window.localStorage.getItem("portfolio-language");
    if (stored === "es" || stored === "zh") locale = stored;
  } catch {
    // Storage can be unavailable in private browsing; English remains the safe default.
  }

  const translatedValue = (key: string) => (locale === "en" ? key : copy[key]?.[locale] ?? key);

  const bindText = (node: Text) => {
    if (knownTextNodes.has(node)) return;
    const key = normalise(node.data);
    if (!key || !copy[key]) return;
    knownTextNodes.add(node);
    textBindings.push({
      node,
      key,
      leading: /^\s/.test(node.data),
      trailing: /\s$/.test(node.data),
    });
  };

  const bindAttribute = (element: Element, name: string, forcedKey?: string) => {
    const seen = knownAttributes.get(element) ?? new Set<string>();
    if (seen.has(name)) return;
    const key = normalise(forcedKey ?? element.getAttribute(name) ?? "");
    if (!key || !copy[key]) return;
    seen.add(name);
    knownAttributes.set(element, seen);
    attributeBindings.push({ element, name, key });
  };

  const bindRoot = (root: Node) => {
    if (root.nodeType === Node.TEXT_NODE) bindText(root as Text);
    if (root instanceof Element) {
      translatableAttributes.forEach((name) => bindAttribute(root, name));
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as Element;
          return parent?.closest("script, style") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        },
      },
    );
    let current = walker.nextNode();
    while (current) {
      if (current.nodeType === Node.TEXT_NODE) bindText(current as Text);
      if (current instanceof Element) {
        translatableAttributes.forEach((name) => bindAttribute(current as Element, name));
      }
      current = walker.nextNode();
    }
  };

  document.querySelectorAll<HTMLMetaElement>(
    'meta[name="description"], meta[name="keywords"], meta[property="og:title"], meta[property="og:description"], meta[property="og:image:alt"], meta[name="twitter:title"], meta[name="twitter:description"]',
  ).forEach((meta) => bindAttribute(meta, "content"));

  const applyLocale = (nextLocale: Locale) => {
    locale = nextLocale;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
    selector.value = locale;
    textBindings.forEach(({ node, key, leading, trailing }) => {
      const value = translatedValue(key);
      node.data = `${leading ? " " : ""}${value}${trailing ? " " : ""}`;
    });
    attributeBindings.forEach(({ element, name, key }) => {
      element.setAttribute(name, translatedValue(key));
    });
    const ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');
    if (ogLocale) ogLocale.content = locale === "es" ? "es_ES" : locale === "zh" ? "zh_CN" : "en_US";
    try {
      window.localStorage.setItem("portfolio-language", locale);
    } catch {
      // The selected language still applies for the current session.
    }
  };

  bindRoot(document.documentElement);
  applyLocale(locale);

  const observer = new MutationObserver((mutations) => {
    let hasNewCopy = false;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        const previousCount = textBindings.length + attributeBindings.length;
        bindRoot(node);
        hasNewCopy ||= textBindings.length + attributeBindings.length > previousCount;
      });
    });
    if (hasNewCopy) applyLocale(locale);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  selector.addEventListener("change", () => {
    const nextLocale = selector.value;
    if (nextLocale === "en" || nextLocale === "es" || nextLocale === "zh") {
      applyLocale(nextLocale);
    }
  });
};

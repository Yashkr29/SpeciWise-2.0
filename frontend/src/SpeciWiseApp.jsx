import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

/* ═══════════════════════════════════════════════════════════════════════════════
   PALETTE  caf0f8 · 90e0ef · 00b4d8 · 0077b6 · 03045e
═══════════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA — DOMAINS
═══════════════════════════════════════════════════════════════════════════════ */
const DOMAINS = {
  ENG: { name:"Engineering & Technology", icon:"⚙️", color:"#0077b6", bg:"rgba(0,119,182,0.08)", border:"rgba(0,119,182,0.25)", tagline:"Build the future with code and machines", desc:"Engineering blends creativity and science to solve real-world challenges. From software systems to civil infrastructure, engineers shape the modern world through relentless innovation.", careers:["Software Engineer","Robotics Developer","Data Scientist","Systems Architect","IoT Engineer"], badges:["B.Tech / BE","4 years","IIT / NIT / BITS"] },
  MED: { name:"Medical & Healthcare", icon:"🏥", color:"#00b4d8", bg:"rgba(0,180,216,0.08)", border:"rgba(0,180,216,0.25)", tagline:"Heal, innovate, and save lives", desc:"Medicine and healthcare offer deeply rewarding careers. From clinical practice to biomedical research, the field demands empathy, precision, and lifelong learning.", careers:["Doctor / Surgeon","Pharmacist","Medical Researcher","Nurse Practitioner","Radiologist"], badges:["MBBS / BDS","5.5 years","NEET Required"] },
  COM: { name:"Commerce & Business", icon:"📈", color:"#0077b6", bg:"rgba(0,119,182,0.07)", border:"rgba(0,119,182,0.22)", tagline:"Drive economies, build empires", desc:"Commerce and business unlock the world of finance, management, and entrepreneurship. Build companies, manage global markets, or lead organizations from the front.", careers:["CA / CPA","MBA Manager","Financial Analyst","Entrepreneur","Investment Banker"], badges:["B.Com / BBA","3 years","CA / CFA optional"] },
  ART: { name:"Arts & Humanities", icon:"🎭", color:"#03045e", bg:"rgba(3,4,94,0.07)", border:"rgba(3,4,94,0.2)", tagline:"Tell stories, shape culture", desc:"Arts and humanities explore the human condition through language, history, philosophy, and culture. Careers span media, education, research, civil services, and beyond.", careers:["Journalist","Teacher / Professor","Content Creator","Psychologist","Civil Servant"], badges:["BA / MA","3 years","UPSC / Media / NGO"] },
  SCI: { name:"Pure Sciences", icon:"🔬", color:"#00b4d8", bg:"rgba(0,180,216,0.07)", border:"rgba(0,180,216,0.22)", tagline:"Unravel the mysteries of the universe", desc:"Pure sciences — Physics, Chemistry, Biology, Math — form the backbone of all research and academia. Lead discoveries that redefine our understanding of reality itself.", careers:["Research Scientist","Astrophysicist","Chemist","Biologist","University Professor"], badges:["B.Sc / M.Sc","3-5 years","IISc / IISER / IIT"] },
  LAW: { name:"Law & Justice", icon:"⚖️", color:"#03045e", bg:"rgba(3,4,94,0.06)", border:"rgba(3,4,94,0.18)", tagline:"Defend rights, uphold justice", desc:"Law offers a powerful and prestigious career — from courts to corporate boardrooms. Combine sharp analytical thinking with advocacy, ethics, and societal leadership.", careers:["Lawyer / Advocate","Judge","Legal Consultant","Public Prosecutor","Policy Analyst"], badges:["BA LLB / LLB","5 years","CLAT Required"] },
  DES: { name:"Design & Architecture", icon:"✏️", color:"#0077b6", bg:"rgba(0,119,182,0.07)", border:"rgba(0,119,182,0.22)", tagline:"Create beauty, shape spaces", desc:"Design and architecture merge art with function. Craft breathtaking structures or digital experiences that delight millions. A career built at the intersection of logic and beauty.", careers:["Architect","UI/UX Designer","Interior Designer","Product Designer","Urban Planner"], badges:["B.Arch / B.Des","4-5 years","NATA / NID Required"] },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA — DOMAIN QUESTIONS
═══════════════════════════════════════════════════════════════════════════════ */
const DOMAIN_QS = [
  { q:"Which subjects do you enjoy studying the most?", opts:[{text:"Mathematics, Physics & Computers",w:{ENG:3,SCI:2}},{text:"Biology, Chemistry & Human Body",w:{MED:3,SCI:2}},{text:"Economics, Accounts & Business Studies",w:{COM:3,LAW:1}},{text:"History, Languages & Social Studies",w:{ART:3,LAW:2}}]},
  { q:"What kind of work excites you the most?", opts:[{text:"Designing and building real things",w:{ENG:3,DES:2}},{text:"Diagnosing and treating patients",w:{MED:3,SCI:1}},{text:"Running businesses & closing deals",w:{COM:3,LAW:1}},{text:"Writing, teaching & public speaking",w:{ART:3,LAW:2}}]},
  { q:"In your free time, you would rather:", opts:[{text:"Code, tinker with gadgets or experiment",w:{ENG:3,SCI:2}},{text:"Volunteer, help, or care for others",w:{MED:3,ART:1}},{text:"Read about finance, startups & markets",w:{COM:3}},{text:"Draw, make music, or do photography",w:{DES:3,ART:2}}]},
  { q:"Which career sounds most appealing?", opts:[{text:"Software Engineer / AI Developer",w:{ENG:3,SCI:1}},{text:"Doctor / Surgeon / Pharmacist",w:{MED:3}},{text:"CA / MBA Manager / Entrepreneur",w:{COM:3,LAW:1}},{text:"Lawyer / Journalist / Social Worker",w:{LAW:3,ART:2}}]},
  { q:"How do you best solve problems?", opts:[{text:"Logically, step-by-step using formulas & data",w:{ENG:3,SCI:2}},{text:"Analyzing symptoms and patterns carefully",w:{MED:3,SCI:1}},{text:"Through strategy, planning & negotiation",w:{COM:3,LAW:2}},{text:"Creatively through storytelling or design",w:{ART:3,DES:2}}]},
  { q:"Which skill are you most proud of?", opts:[{text:"Technical — coding, math, logical analysis",w:{ENG:3,SCI:1}},{text:"Empathy — truly connecting with people",w:{MED:3,ART:1}},{text:"Leadership & team management",w:{COM:3,LAW:1}},{text:"Creativity & aesthetic sensibility",w:{DES:3,ART:2}}]},
  { q:"What is your ideal work environment?", opts:[{text:"A tech company, research lab or startup",w:{ENG:3,SCI:2}},{text:"A hospital, clinic or research centre",w:{MED:3}},{text:"A corporate office or financial firm",w:{COM:3}},{text:"A courtroom, media house or school",w:{LAW:3,ART:2}}]},
  { q:"Which global challenge would you most want to tackle?", opts:[{text:"Develop AI & clean renewable energy",w:{ENG:3,SCI:2}},{text:"Eliminate diseases & improve global health",w:{MED:3,SCI:1}},{text:"Reduce poverty through business innovation",w:{COM:3,LAW:1}},{text:"Preserve culture & champion human rights",w:{ART:2,LAW:3}}]},
  { q:"How do you feel about working with numbers & data?", opts:[{text:"Love it — it's my biggest superpower",w:{ENG:3,SCI:2,COM:2}},{text:"Fine with it when it helps people",w:{MED:2,SCI:1}},{text:"Yes — especially financial data & trends",w:{COM:3,LAW:1}},{text:"Not really — I prefer words and ideas",w:{ART:3,LAW:2}}]},
  { q:"What motivates you the most?", opts:[{text:"Innovating & creating new technologies",w:{ENG:3,DES:1}},{text:"Saving lives & reducing suffering",w:{MED:3,SCI:1}},{text:"Achieving financial freedom & success",w:{COM:3}},{text:"Fighting for justice & human dignity",w:{LAW:3,ART:1}}]},
  { q:"Pick the activity that sounds most exciting:", opts:[{text:"Build a robot or launch a tech product",w:{ENG:3}},{text:"Conduct medical research on diseases",w:{MED:3,SCI:2}},{text:"Launch a startup or manage investments",w:{COM:3}},{text:"Design a building or create a documentary",w:{DES:3,ART:2}}]},
  { q:"Which course would you study for 4+ years?", opts:[{text:"B.Tech / BE — Engineering",w:{ENG:3}},{text:"MBBS / Pharmacy / Nursing",w:{MED:3}},{text:"B.Com / BBA / Economics",w:{COM:3,LAW:1}},{text:"BA / LLB / Mass Communication",w:{ART:2,LAW:3}}]},
];

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA — ENGINEERING BRANCHES
═══════════════════════════════════════════════════════════════════════════════ */
const BRANCHES = {
  CS: { name:"Computer Science & IT", icon:"💻", color:"#0077b6", tagline:"Code, software & digital systems", careers:["Software Engineer","Full Stack Dev","System Architect","DevOps Engineer"] },
  AI: { name:"AI & Data Science",     icon:"🤖", color:"#00b4d8", tagline:"Intelligent systems & big data",  careers:["ML Engineer","Data Scientist","AI Researcher","NLP Engineer"] },
  ME: { name:"Mechanical Engineering",icon:"⚙️", color:"#03045e", tagline:"Machines, thermodynamics & manufacturing", careers:["Mechanical Engineer","CAD Designer","Automotive Engineer","Production Manager"] },
  EE: { name:"Electrical & Electronics",icon:"⚡",color:"#0077b6", tagline:"Circuits, power & embedded systems", careers:["VLSI Engineer","Power Systems Eng","Embedded Dev","Control Engineer"] },
  CE: { name:"Civil Engineering",     icon:"🏗️", color:"#00b4d8", tagline:"Infrastructure, structures & urban planning", careers:["Structural Engineer","Urban Planner","Environmental Eng","Project Manager"] },
  CH: { name:"Chemical Engineering",  icon:"🧪", color:"#03045e", tagline:"Processes, materials & energy", careers:["Process Engineer","Petroleum Engineer","Polymer Scientist","Env. Consultant"] },
  BT: { name:"Biotechnology",         icon:"🧬", color:"#0077b6", tagline:"Life sciences meets engineering", careers:["Biomedical Eng","Bioinformatician","Genetic Researcher","Pharma Engineer"] },
};

const BRANCH_QS = [
  { q:"Which area of technology excites you the most?", opts:[{text:"Software, apps, websites & AI systems",w:{CS:3,AI:2}},{text:"Machines, engines & manufacturing",w:{ME:3}},{text:"Circuits, power systems & electronics",w:{EE:3}},{text:"Buildings, bridges & infrastructure",w:{CE:3}}]},
  { q:"What project would you love to build?", opts:[{text:"An AI-powered web app or platform",w:{CS:3,AI:3}},{text:"A robotic arm or mechanical system",w:{ME:3,EE:1}},{text:"A smart power grid or solar farm",w:{EE:3,ME:1}},{text:"A sustainable housing complex or bridge",w:{CE:3}}]},
  { q:"Which engineering subject appeals to you most?", opts:[{text:"Data Structures, Algorithms & OS",w:{CS:3,AI:2}},{text:"Thermodynamics & Fluid Mechanics",w:{ME:3}},{text:"Semiconductors & Electromagnetism",w:{EE:3}},{text:"Soil Mechanics & Structural Design",w:{CE:3}}]},
  { q:"How do you feel about biology and chemistry?", opts:[{text:"Not really — I'm a pure code/computer person",w:{CS:3,AI:2}},{text:"Indifferent — I prefer mechanical systems",w:{ME:3,EE:1}},{text:"Somewhat interested as a secondary field",w:{CH:2,BT:2,EE:1}},{text:"Very interested — biotech genuinely fascinates me",w:{BT:3,CH:2}}]},
  { q:"How much do you enjoy coding and programming?", opts:[{text:"Love it — it's my main calling in life",w:{CS:3,AI:3}},{text:"Somewhat — I prefer hardware & circuits",w:{EE:2,ME:1}},{text:"Not much — I prefer physical systems",w:{ME:3,CE:2}},{text:"As an analytical tool, yes",w:{CH:2,BT:2,CE:1}}]},
  { q:"Which career path appeals to you most?", opts:[{text:"Software Developer / Cloud Architect",w:{CS:3,AI:2}},{text:"Automobile / Aerospace Engineer",w:{ME:3}},{text:"VLSI / Embedded Systems Engineer",w:{EE:3}},{text:"Structural / Environmental Engineer",w:{CE:3}}]},
  { q:"What impact do you want your engineering to have?", opts:[{text:"Digitize the world & build smart systems",w:{CS:3,AI:3}},{text:"Improve manufacturing & automation",w:{ME:3}},{text:"Power the world through clean energy",w:{EE:3,ME:1}},{text:"Build sustainable cities & infrastructure",w:{CE:3}}]},
  { q:"Which tools would you most like to master?", opts:[{text:"Python, JavaScript, Docker, AWS",w:{CS:3,AI:2}},{text:"CATIA, SolidWorks, ANSYS",w:{ME:3}},{text:"MATLAB, Cadence, Verilog / VHDL",w:{EE:3}},{text:"AutoCAD, SAP2000, STAAD.Pro",w:{CE:3}}]},
  { q:"Are you drawn to working with living systems?", opts:[{text:"No — purely into digital / software",w:{CS:3,AI:2}},{text:"No — I prefer mechanical or electrical hardware",w:{ME:3,EE:1}},{text:"Yes — biomedical devices interest me",w:{BT:3,EE:1}},{text:"Yes — biotech & pharmaceuticals fascinate me",w:{BT:3,CH:3}}]},
  { q:"Where do you picture yourself working?", opts:[{text:"Top tech company, startup or FAANG",w:{CS:3,AI:3}},{text:"Auto, aerospace or manufacturing industry",w:{ME:3}},{text:"Power sector or semiconductor company",w:{EE:3}},{text:"Construction firm, government or urban planning",w:{CE:3}}]},
];

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA — CS SPECIALIZATION
═══════════════════════════════════════════════════════════════════════════════ */
const CS_SPEC_QS = [
  { id:"q1",  text:"What activity excites you most?",            options:["Solving logic puzzles","Automating boring tasks","Analyzing patterns in data","Making intelligent systems","Creating secure systems"] },
  { id:"q2",  text:"Which CS topic fascinates you?",             options:["Algorithms and computation","Internet and cloud services","Data trends and analysis","Neural networks and AI","Data privacy and encryption"] },
  { id:"q3",  text:"What would you build first?",                options:["A code compiler","A cloud-based file app","A movie recommendation system","A self-learning chatbot","A secure login system"] },
  { id:"q4",  text:"How do you relate to math?",                 options:["I enjoy complex math","Basic math is fine","I love using stats to find trends","Math helps me understand AI","I use it only when necessary"] },
  { id:"q5",  text:"What kind of problems do you love solving?", options:["Technical, deep logic","Real-world scaling issues","Predicting behavior using data","Creating intelligent machines","Preventing digital attacks"] },
  { id:"q6",  text:"What do you want your code to do?",          options:["Improve speed and efficiency","Work over the internet","Show trends or insights","Learn over time","Offer strong protection"] },
  { id:"q7",  text:"What tech news grabs your attention?",       options:["New programming languages","Big tech infrastructure updates","Big data trends or analytics","New AI innovations","Recent hacking attempts"] },
  { id:"q8",  text:"How do you prefer to work?",                 options:["Focused and solo","Distributed team environment","With data at hand","Creative and experimental","Carefully and cautiously"] },
  { id:"q9",  text:"What's your ideal weekend project?",         options:["Code a new system","Set up servers and APIs","Visualize patterns","Make systems smart","Encrypt and protect data"] },
  { id:"q10", text:"Which career sounds most like you?",         options:["Software engineer","DevOps/cloud architect","Data analyst","AI/ML engineer","Security specialist"] },
  { id:"q11", text:"What excites you most about CS?",            options:["Logical thinking","Large-scale tech impact","Finding answers in data","Mimicking human intelligence","Securing critical systems"] },
  { id:"q12", text:"What frustrates you most in tech?",          options:["Inefficient code","Poor internet speed","Messy data","Repetitive tasks","Data breaches"] },
  { id:"q13", text:"Where do you see yourself specializing?",    options:["Yes, in computer science","Maybe, in cloud or networking","Possibly, in data science","Definitely, in AI/ML","Yes, in cybersecurity"] },
  { id:"q14", text:"What's your take on the future of tech?",    options:["Fast innovation pace","Everything is moving to the cloud","Data is becoming powerful","AI is changing lives","We need better protection"] },
  { id:"q15", text:"In a team, what role suits you best?",       options:["Lead programmer","Deployment or systems setup","Analyst or presenter","Design logic or AI behavior","Security checker or troubleshooter"] },
  { id:"q16", text:"What matters most in great software?",       options:["The logic","Speed and reliability","User behavior insights","Personalization","Data protection"] },
  { id:"q17", text:"What are you most curious about?",           options:["How things work","How systems connect","How data tells stories","How machines think","How to protect systems"] },
  { id:"q18", text:"What would you try in your free time?",      options:["Compete in coding contests","Set up servers","Play with datasets","Train a chatbot","Try ethical hacking"] },
];
const CS_WEIGHT_MAP = [
  ["CC","CL","AA","AE","CY"],["CC","CL","AA","AE","CY"],["CC","CL","BD","AE","CY"],
  ["CC","CL","AA","AE","BC"],["CC","CL","AA","AE","CY"],["CC","CL","AA","AE","CY"],
  ["CC","CL","BD","AE","CY"],["CC","CL","AA","AE","CY"],["CC","CL","BD","AE","CY"],
  ["CC","CL","AA","AE","CY"],["CC","CL","AA","AE","CY"],["CC","CL","BD","AE","CY"],
  ["CC","CL","AA","AE","CY"],["CC","CL","BD","AE","CY"],["CC","CL","AA","AE","CY"],
  ["CC","CL","AA","AE","CY"],["CC","CL","AA","AE","CY"],["CC","CL","BD","AE","CY"],
];
const CS_SPECS = {
  CC: { name:"Core CS & Algorithms",    icon:"⚙️", color:"#0077b6", tagline:"Logic is your superpower",      desc:"You thrive on algorithms, data structures, and clean code. Competitive programming and system design are your natural habitat.",         careers:["Software Engineer","Algorithm Designer","System Architect"] },
  AA: { name:"AI & Data Analytics",     icon:"📊", color:"#00b4d8", tagline:"You see stories in numbers",    desc:"You turn raw data into powerful insights. Statistical modeling, visualization, and machine learning analytics define your path.",        careers:["Data Scientist","ML Analyst","BI Engineer"] },
  AE: { name:"AI / ML Engineering",     icon:"🤖", color:"#03045e", tagline:"You build minds",               desc:"Neural networks, model training, and intelligent automation are your domain. You engineer systems that learn and adapt.",                 careers:["ML Engineer","AI Researcher","NLP Engineer"] },
  CL: { name:"Cloud Computing",         icon:"☁️", color:"#0077b6", tagline:"You think at scale",            desc:"Infrastructure, distributed systems, and deployment pipelines excite you. Your work powers millions of users worldwide.",                careers:["Cloud Architect","DevOps Engineer","SRE"] },
  CY: { name:"Cybersecurity",           icon:"🔐", color:"#00b4d8", tagline:"You guard the digital world",   desc:"Ethical hacking, cryptography, and threat detection are your calling. You protect what matters most in the digital age.",                 careers:["Security Engineer","Pen Tester","Cryptographer"] },
  BD: { name:"Big Data Engineering",    icon:"🗄️", color:"#03045e", tagline:"Data at massive scale",         desc:"You love building data pipelines, working with distributed databases, and uncovering hidden trends at massive scale.",                   careers:["Data Engineer","Big Data Architect","ETL Developer"] },
  BC: { name:"Blockchain & Cryptography",icon:"🔗",color:"#0077b6", tagline:"Decentralized by nature",       desc:"Trustless systems, encryption, and digital sovereignty define you. You're building the secure, decentralized future.",                   careers:["Blockchain Dev","Smart Contract Engineer","Crypto Researcher"] },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA — EE SPECIALIZATION
   Two tracks: ECE (Electronics & Communication) · ECM (Electronics & Computer)
═══════════════════════════════════════════════════════════════════════════════ */
const EE_SPEC_QS = [
  { id:"e1",  text:"Which topic excites you more in electronics?",           options:["Wireless communication & signal processing","VLSI design & digital circuits","Antenna & RF systems","Embedded systems & microcontrollers","Both equally interest me"] },
  { id:"e2",  text:"What kind of project would you love to work on?",        options:["Design a 5G base station antenna","Build a custom processor chip","Develop IoT sensor networks","Create a smart communication device","Real-time image processing system"] },
  { id:"e3",  text:"Which field of math do you find most useful?",           options:["Signals & Fourier analysis","Boolean algebra & logic design","Probability & information theory","Control systems & differential equations","Linear algebra for ML applications"] },
  { id:"e4",  text:"What career excites you most?",                          options:["Telecom engineer at Airtel / Jio","VLSI designer at Intel / TSMC","RF engineer at Qualcomm","Embedded developer at automotive firm","ML hardware engineer"] },
  { id:"e5",  text:"Which lab would you enjoy spending time in?",            options:["Signal processing & communication lab","VLSI & semiconductor fabrication lab","Antenna design & testing lab","Embedded systems & robotics lab","Computer architecture & HPC lab"] },
  { id:"e6",  text:"How do you feel about programming?",                     options:["I prefer hardware design over code","I love coding for embedded systems","Programming is secondary to circuit design","I enjoy both hardware and software equally","I want to do ML on hardware"] },
  { id:"e7",  text:"Which technology trend excites you most?",               options:["5G & 6G networks","AI chips & neuromorphic computing","Satellite communication","Smart grid & power electronics","Edge computing & FPGA"] },
  { id:"e8",  text:"Pick the subject you'd love to master:",                 options:["Digital signal processing","Computer architecture","Optical fiber communication","Microcontroller & RTOS programming","Deep learning on hardware"] },
  { id:"e9",  text:"What's your dream work location?",                       options:["A telecom company building networks","A semiconductor fab designing chips","A space research org building antennas","An automotive company for EVs","A cloud company for hardware acceleration"] },
  { id:"e10", text:"Which skill would you most want to develop?",            options:["Signal modulation & demodulation","VHDL / Verilog chip design","RF circuit design & simulation","Embedded C & RTOS programming","CUDA / parallel computing programming"] },
  { id:"e11", text:"Which best describes your interest?",                    options:["Sending data across the world wirelessly","Making chips smaller and faster","Designing circuits that think","Building devices that respond in real time","Bridging hardware and intelligent software"] },
  { id:"e12", text:"What frustrates you most in electronics?",               options:["Signal loss & interference","Slow clock speeds & bottlenecks","Poor connectivity infrastructure","Unreliable firmware","Hardware that can't run modern AI"] },
];

/* 
  ECE = Electronics & Communication Engineering
  ECM = Electronics & Computer Engineering
  Scoring: each option maps to ECE or ECM with weight
*/
const EE_WEIGHT_MAP = [
  // e1
  [{ECE:3},{ECM:3},{ECE:3},{ECM:2},{ECE:1,ECM:1}],
  // e2
  [{ECE:3},{ECM:3},{ECE:2,ECM:1},{ECE:2,ECM:1},{ECM:3}],
  // e3
  [{ECE:3},{ECM:3},{ECE:2},{ECM:2},{ECM:3}],
  // e4
  [{ECE:3},{ECM:3},{ECE:3},{ECM:2},{ECM:3}],
  // e5
  [{ECE:3},{ECM:3},{ECE:3},{ECM:2},{ECM:3}],
  // e6
  [{ECE:2},{ECM:3},{ECE:2},{ECE:1,ECM:1},{ECM:3}],
  // e7
  [{ECE:3},{ECM:3},{ECE:3},{ECE:2,ECM:1},{ECM:3}],
  // e8
  [{ECE:3},{ECM:3},{ECE:3},{ECM:3},{ECM:3}],
  // e9
  [{ECE:3},{ECM:3},{ECE:3},{ECM:2},{ECM:3}],
  // e10
  [{ECE:3},{ECM:3},{ECE:3},{ECM:3},{ECM:3}],
  // e11
  [{ECE:3},{ECM:3},{ECM:2},{ECM:3},{ECM:3}],
  // e12
  [{ECE:3},{ECM:2},{ECE:2},{ECM:3},{ECM:3}],
];

const EE_SPECS = {
  ECE: {
    name:"Electronics & Communication Engineering", icon:"📡", color:"#0077b6",
    tagline:"Connecting the world through signals",
    desc:"You're drawn to wireless systems, signal processing, RF circuits, antennas, and telecommunications. You'll build the infrastructure that connects billions of devices worldwide.",
    careers:["Telecom Engineer","RF Engineer","Signal Processing Specialist","Antenna Designer","Network Planning Engineer"],
  },
  ECM: {
    name:"Electronics & Computer Engineering", icon:"🖥️", color:"#00b4d8",
    tagline:"Where silicon meets software",
    desc:"You love the intersection of hardware and computing — VLSI design, embedded systems, computer architecture, and AI hardware. You'll engineer the chips and systems that power modern computing.",
    careers:["VLSI Design Engineer","Embedded Systems Developer","Computer Architecture Engineer","FPGA Developer","Hardware ML Engineer"],
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

@keyframes fadeUp  {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes floatY  {0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes spin    {to{transform:rotate(360deg)}}
@keyframes barGrow {from{width:0}}
@keyframes blink   {0%,100%{opacity:1}50%{opacity:.4}}
@keyframes blobPulse{0%,100%{transform:scale(1) translate(0,0)}33%{transform:scale(1.08) translate(2%,1%)}66%{transform:scale(.94) translate(-1%,2%)}}
@keyframes wave1   {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes wave2   {0%{transform:translateX(-50%)}100%{transform:translateX(0)}}

body{margin:0;padding:0;font-family:'Space Grotesk',system-ui,sans-serif;}

/* ─── App shell ─── */
.sw-app{
  min-height:100vh;
  color:#03045e;
  position:relative;
  overflow-x:hidden;
}

/* ─── Wave background ─── */
.sw-bg{
  position:fixed;inset:0;z-index:0;
  background:linear-gradient(180deg, #ffffff 0%, #00b4d8 100%);
}
.sw-waves{position:absolute;bottom:0;left:0;width:100%;height:100%;pointer-events:none;}
.sw-wave-layer{
  position:absolute;bottom:0;left:0;
  width:200%;height:55%;
  background-repeat:repeat-x;
  background-size:50% 100%;
}
.sw-wave-layer-1{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%2390e0ef' fill-opacity='0.5' d='M0,192 C180,256 360,128 540,192 C720,256 900,128 1080,192 C1260,256 1350,224 1440,192 L1440,320 L0,320 Z'/%3E%3C/svg%3E");
  animation:wave1 12s linear infinite;
  opacity:.7;
}
.sw-wave-layer-2{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%2300b4d8' fill-opacity='0.4' d='M0,128 C240,192 480,64 720,128 C960,192 1200,96 1440,128 L1440,320 L0,320 Z'/%3E%3C/svg%3E");
  animation:wave2 16s linear infinite;
  height:45%;opacity:.6;
}
.sw-wave-layer-3{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%230077b6' fill-opacity='0.55' d='M0,224 C360,160 720,288 1080,224 C1260,192 1350,256 1440,224 L1440,320 L0,320 Z'/%3E%3C/svg%3E");
  animation:wave1 20s linear infinite;
  height:30%;opacity:.8;
}
.sw-wave-layer-4{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100' preserveAspectRatio='none'%3E%3Cpath fill='%230077b6' fill-opacity='0.9' d='M0,60 C360,20 720,80 1080,40 C1260,20 1350,60 1440,50 L1440,100 L0,100 Z'/%3E%3C/svg%3E");
  animation:wave2 24s linear infinite;
  height:18%;opacity:.9;
}

/* ─── Content layer ─── */
.sw-page{position:relative;z-index:1;}

/* ─── Navbar ─── */
.sw-nav{
  display:flex;align-items:center;justify-content:space-between;
  padding:1rem 2.5rem;
  background:#caf0f8;
  border-bottom:1px solid rgba(0,119,182,0.2);
  position:sticky;top:0;z-index:100;
  box-shadow:0 2px 16px rgba(3,4,94,0.1);
}
.sw-logo{
  font-family:'Sora',sans-serif;font-size:1.45rem;font-weight:800;
  color:#03045e;letter-spacing:-.02em;
}
.sw-logo span{color:#0077b6;}
.sw-nav-badge{
  font-family:'Space Grotesk',sans-serif;font-size:.68rem;font-weight:600;
  letter-spacing:.12em;text-transform:uppercase;
  color:#03045e;background:rgba(0,119,182,0.12);
  border:1.5px solid rgba(0,119,182,0.35);
  padding:.3rem .9rem;border-radius:100px;
}

/* ─── Hero ─── */
.sw-hero{
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;
  padding:6rem 1.5rem 8rem;position:relative;
}

/* Color blobs */
.sw-blob{
  position:absolute;border-radius:50%;pointer-events:none;
  animation:blobPulse 8s ease-in-out infinite;
  filter:blur(60px);
}
.sw-blob-1{width:420px;height:420px;background:rgba(0,119,182,0.18);top:-80px;left:-100px;animation-delay:0s;}
.sw-blob-2{width:300px;height:300px;background:rgba(0,180,216,0.22);top:30%;right:-80px;animation-delay:-3s;}
.sw-blob-3{width:250px;height:250px;background:rgba(3,4,94,0.12);bottom:15%;left:10%;animation-delay:-6s;}

.sw-hero-eyebrow{
  font-family:'Space Grotesk',sans-serif;font-size:.72rem;font-weight:600;
  letter-spacing:.25em;text-transform:uppercase;color:#0077b6;
  margin-bottom:1.4rem;animation:fadeUp .5s ease both;
  background:rgba(202,240,248,0.7);border:1px solid rgba(0,119,182,0.25);
  padding:.35rem 1.1rem;border-radius:100px;display:inline-block;
}
.sw-hero-title{
  font-family:'Sora',sans-serif;
  font-size:clamp(2.8rem,6.5vw,5.5rem);font-weight:800;
  color:#03045e;line-height:1.06;
  margin-bottom:1.5rem;max-width:820px;letter-spacing:-.03em;
  animation:fadeUp .55s ease .07s both;
}
.sw-hero-title .accent{color:#0077b6;}
.sw-hero-sub{
  font-family:'Space Grotesk',sans-serif;color:#023e5a;
  font-size:1.1rem;line-height:1.78;
  margin-bottom:3rem;max-width:540px;font-weight:400;
  animation:fadeUp .55s ease .14s both;
}
.sw-hero-cta-wrap{
  display:flex;align-items:center;gap:1rem;flex-wrap:wrap;justify-content:center;
  animation:fadeUp .55s ease .2s both;margin-bottom:3.5rem;
}
.sw-hero-stats{
  display:flex;gap:2.5rem;flex-wrap:wrap;justify-content:center;
  animation:fadeUp .55s ease .28s both;
}
.sw-stat{display:flex;flex-direction:column;align-items:center;gap:.2rem;}
.sw-stat-num{font-family:'Sora',sans-serif;font-size:1.8rem;font-weight:800;color:#03045e;}
.sw-stat-label{font-size:.75rem;font-weight:500;color:#0077b6;letter-spacing:.06em;text-transform:uppercase;}

/* ─── Buttons ─── */
.sw-btn-primary{
  background:#03045e;color:#caf0f8;
  font-family:'Sora',sans-serif;font-weight:700;font-size:.95rem;
  padding:.95rem 2.8rem;border-radius:100px;border:none;cursor:pointer;
  letter-spacing:.01em;
  box-shadow:0 4px 20px rgba(3,4,94,.3);
  transition:background .2s,transform .17s,box-shadow .2s;
}
.sw-btn-primary:hover{background:#0077b6;transform:translateY(-2px);box-shadow:0 6px 28px rgba(0,119,182,.4);}
.sw-btn-primary:active{transform:translateY(0);}
.sw-btn-primary:disabled{opacity:.35;cursor:not-allowed;transform:none;}

.sw-btn-outline{
  background:rgba(202,240,248,0.6);color:#03045e;
  font-family:'Sora',sans-serif;font-weight:600;font-size:.9rem;
  padding:.88rem 2.2rem;border-radius:100px;
  border:2px solid rgba(0,119,182,0.5);cursor:pointer;
  backdrop-filter:blur(8px);
  transition:all .2s;
}
.sw-btn-outline:hover{background:#caf0f8;border-color:#0077b6;}

.sw-btn-ghost{
  background:transparent;color:#0077b6;
  font-family:'Space Grotesk',sans-serif;font-size:.86rem;font-weight:500;
  padding:.65rem 1.4rem;border-radius:100px;
  border:1.5px solid rgba(0,119,182,0.3);cursor:pointer;
  transition:all .2s;
}
.sw-btn-ghost:hover{background:rgba(0,119,182,0.08);border-color:#0077b6;}

/* ─── Info Section ─── */
.sw-section{
  max-width:1080px;margin:0 auto;padding:5rem 2rem 6rem;
}
.sw-section-chip{
  display:inline-block;
  font-family:'Space Grotesk',sans-serif;font-size:.68rem;font-weight:600;
  letter-spacing:.2em;text-transform:uppercase;color:#0077b6;
  background:rgba(202,240,248,0.8);border:1px solid rgba(0,119,182,.3);
  padding:.32rem .9rem;border-radius:100px;margin-bottom:1rem;
}
.sw-section-title{
  font-family:'Sora',sans-serif;
  font-size:clamp(1.7rem,3.2vw,2.5rem);font-weight:800;
  color:#03045e;margin-bottom:.6rem;letter-spacing:-.025em;text-align:center;
}
.sw-section-sub{
  text-align:center;color:#023e5a;font-size:.96rem;
  line-height:1.72;margin-bottom:3.5rem;
}
.sw-section-header{text-align:center;margin-bottom:.4rem;}

/* Steps grid */
.sw-steps-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));
  gap:1.4rem;margin-bottom:5rem;
}
.sw-step-card{
  background:rgba(202,240,248,0.55);
  border:1px solid rgba(0,119,182,0.18);
  border-radius:20px;padding:2rem;position:relative;overflow:hidden;
  transition:transform .25s,box-shadow .25s,border-color .25s;
  animation:fadeUp .5s ease both;
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
}
.sw-step-card:hover{transform:translateY(-5px);box-shadow:0 14px 40px rgba(3,4,94,.13);border-color:rgba(0,119,182,.4);}
.sw-step-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#0077b6,#00b4d8);}
.sw-step-num{font-family:'Space Grotesk',sans-serif;font-size:.65rem;font-weight:700;color:#0077b6;letter-spacing:.2em;text-transform:uppercase;margin-bottom:1rem;}
.sw-step-icon{font-size:2rem;margin-bottom:.9rem;display:block;}
.sw-step-title{font-family:'Sora',sans-serif;font-size:1.1rem;font-weight:700;color:#03045e;margin-bottom:.5rem;}
.sw-step-desc{color:#023e5a;font-size:.875rem;line-height:1.72;}

/* What-grid */
.sw-what-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem;margin-bottom:4rem;}
.sw-what-card{
  background:rgba(202,240,248,0.5);border:1px solid rgba(0,119,182,.18);
  border-radius:16px;padding:1.4rem;display:flex;gap:.9rem;align-items:flex-start;
  animation:fadeUp .5s ease both;backdrop-filter:blur(10px);
}
.sw-what-icon{font-size:1.3rem;flex-shrink:0;margin-top:2px;}
.sw-what-text h4{font-family:'Sora',sans-serif;font-size:.9rem;font-weight:700;color:#03045e;margin-bottom:.28rem;}
.sw-what-text p{font-size:.83rem;color:#023e5a;line-height:1.62;}

/* CTA banner */
.sw-cta-banner{
  background:linear-gradient(135deg,#03045e 0%,#0077b6 100%);
  border-radius:24px;padding:3.5rem 2rem;
  display:flex;flex-direction:column;align-items:center;gap:1.1rem;
  position:relative;overflow:hidden;
}
.sw-cta-banner::before{content:'';position:absolute;top:-60%;right:-10%;width:350px;height:350px;background:radial-gradient(circle,rgba(0,180,216,.2) 0%,transparent 70%);pointer-events:none;}
.sw-cta-title{font-family:'Sora',sans-serif;font-size:clamp(1.5rem,3vw,2rem);font-weight:800;color:#caf0f8;text-align:center;letter-spacing:-.02em;}
.sw-cta-sub{color:rgba(144,224,239,.75);text-align:center;font-size:.93rem;}
.sw-cta-banner .sw-btn-primary{background:#00b4d8;color:#03045e;margin-top:.4rem;}
.sw-cta-banner .sw-btn-primary:hover{background:#90e0ef;}

/* Domain chips */
.sw-domain-peek{display:flex;gap:.45rem;flex-wrap:wrap;justify-content:center;margin-top:2rem;animation:fadeUp .55s ease .32s both;}
.sw-domain-chip{
  background:rgba(202,240,248,0.55);border:1px solid rgba(0,119,182,.22);
  color:#03045e;padding:.3rem .82rem;border-radius:8px;
  font-size:.73rem;font-family:'Space Grotesk',sans-serif;font-weight:500;
  transition:all .2s;backdrop-filter:blur(8px);
}
.sw-domain-chip:hover{background:rgba(0,119,182,.12);border-color:#0077b6;color:#0077b6;}

/* ─── Quiz ─── */
.sw-quiz{display:flex;flex-direction:column;min-height:100vh;}
.sw-progress-track{height:4px;background:rgba(202,240,248,0.3);flex-shrink:0;}
.sw-progress-fill{height:100%;background:linear-gradient(90deg,#00b4d8,#03045e);transition:width .4s ease;}

.sw-quiz-header{
  display:flex;justify-content:space-between;align-items:center;
  padding:1.1rem 2.5rem;
  border-bottom:1px solid rgba(202,240,248,0.3);
  background:rgba(202,240,248,0.15);backdrop-filter:blur(12px);
}
.sw-quiz-title{font-family:'Space Grotesk',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#caf0f8;}
.sw-counter{font-family:'Space Grotesk',sans-serif;font-size:.85rem;color:rgba(202,240,248,.7);}
.sw-counter strong{color:#caf0f8;font-weight:700;}

.sw-quiz-body{flex:1;display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem;}

/* Glassmorphism question card */
.sw-question-wrap{
  width:100%;max-width:700px;
  background:rgba(3,4,94,0.38);
  border:1px solid rgba(202,240,248,0.4);
  border-radius:24px;
  padding:2.5rem 2rem;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:0 8px 32px rgba(3,4,94,0.15),inset 0 1px 0 rgba(255,255,255,0.3);
  animation:fadeUp .38s ease both;
}
.sw-q-label{font-family:'Space Grotesk',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#90e0ef;margin-bottom:.95rem;}
.sw-q-text{
  font-family:'Sora',sans-serif;
  color:#caf0f8;font-size:clamp(1.2rem,2.8vw,1.65rem);
  font-weight:700;line-height:1.38;margin-bottom:1.9rem;letter-spacing:-.015em;
}
.sw-options{display:flex;flex-direction:column;gap:.65rem;}
.sw-opt{
  background:rgba(202,240,248,0.12);
  border:1.5px solid rgba(202,240,248,0.25);
  border-radius:14px;padding:.95rem 1.25rem;
  color:#caf0f8;font-family:'Space Grotesk',sans-serif;font-size:.95rem;font-weight:400;
  text-align:left;cursor:pointer;
  display:flex;align-items:center;gap:.95rem;
  transition:all .2s ease;
  backdrop-filter:blur(8px);
}
.sw-opt:hover{background:rgba(0,119,182,0.3);border-color:rgba(0,180,216,0.6);transform:translateX(4px);}
.sw-opt--selected{background:rgba(0,119,182,0.4)!important;border-color:#00b4d8!important;color:#caf0f8;}
.sw-opt-letter{
  width:28px;height:28px;border-radius:8px;flex-shrink:0;
  background:rgba(202,240,248,0.15);border:1px solid rgba(202,240,248,0.3);
  display:flex;align-items:center;justify-content:center;
  font-family:'Space Grotesk',sans-serif;font-size:.7rem;font-weight:700;color:#90e0ef;
}
.sw-opt--selected .sw-opt-letter{background:#0077b6;color:#caf0f8;border-color:#0077b6;}

.sw-dots{padding:1rem;display:flex;justify-content:center;gap:5px;flex-wrap:wrap;}
.sw-dot{height:5px;width:5px;border-radius:3px;background:rgba(202,240,248,0.25);transition:all .3s;}
.sw-dot--done{background:rgba(0,180,216,0.55);}
.sw-dot--active{background:#00b4d8;width:18px;}

/* ─── Loading ─── */
.sw-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:1.5rem;}
.sw-spinner{width:40px;height:40px;border:3px solid rgba(202,240,248,0.2);border-top-color:#00b4d8;border-radius:50%;animation:spin .7s linear infinite;}
.sw-loading-text{font-family:'Space Grotesk',sans-serif;font-size:.8rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#90e0ef;animation:blink 1.4s ease infinite;}

/* ─── Result pages ─── */
.sw-result{padding:2.5rem 1.5rem 5rem;}
.sw-result-inner{max-width:900px;margin:0 auto;animation:fadeUp .48s ease both;}
.sw-result-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#90e0ef;margin-bottom:.5rem;}
.sw-result-title{font-family:'Sora',sans-serif;font-size:clamp(1.6rem,4vw,2.5rem);font-weight:800;color:#caf0f8;letter-spacing:-.02em;margin-bottom:2rem;}

/* top match card - glass */
.sw-top-card{
  border-radius:22px;padding:2rem;margin-bottom:1.5rem;
  position:relative;overflow:hidden;border:1px solid;
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  box-shadow:0 8px 32px rgba(3,4,94,.15);
}
.sw-top-shine{position:absolute;top:0;left:0;right:0;height:2px;}
.sw-top-body{display:flex;align-items:flex-start;gap:1.4rem;flex-wrap:wrap;}
.sw-top-icon{font-size:2.8rem;animation:floatY 3s ease-in-out infinite;flex-shrink:0;}
.sw-top-info{flex:1;min-width:200px;}
.sw-top-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.42rem;}
.sw-top-name{font-family:'Sora',sans-serif;font-size:clamp(1.2rem,3vw,1.75rem);font-weight:800;color:#03045e;margin-bottom:.3rem;letter-spacing:-.015em;}
.sw-top-tagline{font-family:'Space Grotesk',sans-serif;font-size:.92rem;font-weight:500;margin-bottom:.65rem;}
.sw-top-desc{color:#023e5a;line-height:1.76;font-size:.88rem;margin-bottom:.95rem;}
.sw-careers{display:flex;gap:.38rem;flex-wrap:wrap;}
.sw-career-tag{border:1.5px solid;padding:.24rem .7rem;border-radius:100px;font-size:.72rem;font-family:'Space Grotesk',sans-serif;font-weight:600;}
.sw-badges-row{display:flex;gap:.38rem;flex-wrap:wrap;margin-top:.75rem;}
.sw-badge{background:rgba(3,4,94,.08);border:1px solid rgba(3,4,94,.15);color:#03045e;padding:.2rem .6rem;border-radius:6px;font-size:.68rem;font-family:'Space Grotesk',sans-serif;font-weight:600;}

/* grid & panel */
.sw-grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.25rem;margin-bottom:1.4rem;}
.sw-panel{
  background:rgba(202,240,248,0.3);border:1px solid rgba(202,240,248,.5);
  border-radius:18px;padding:1.5rem;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
}
.sw-panel-title{font-family:'Sora',sans-serif;font-size:.88rem;font-weight:700;color:#03045e;margin-bottom:1.05rem;}
.sw-rankings{display:flex;flex-direction:column;gap:.82rem;}
.sw-rank-label{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;margin-bottom:.3rem;color:#023e5a;font-family:'Space Grotesk',sans-serif;}
.sw-rank-pct{font-size:.78rem;font-weight:700;}
.sw-bar-track{height:5px;background:rgba(3,4,94,.1);border-radius:3px;overflow:hidden;}
.sw-bar-fill{height:100%;border-radius:3px;animation:barGrow 1.1s ease both;}
.sw-actions{display:flex;gap:.88rem;flex-wrap:wrap;margin-top:.5rem;}

/* eng banner */
.sw-eng-banner{
  background:rgba(0,119,182,0.15);border:1px solid rgba(0,180,216,.35);
  border-radius:16px;padding:1.4rem;margin-bottom:1.4rem;
  animation:fadeUp .5s ease both;backdrop-filter:blur(12px);
}
.sw-eng-banner-label{font-family:'Space Grotesk',sans-serif;font-size:.63rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#00b4d8;margin-bottom:.4rem;}
.sw-eng-banner-title{font-family:'Sora',sans-serif;font-size:1.02rem;font-weight:700;color:#caf0f8;margin-bottom:.38rem;}
.sw-eng-banner-desc{font-family:'Space Grotesk',sans-serif;color:rgba(202,240,248,.8);font-size:.85rem;line-height:1.68;}

/* ─── Bridge ─── */
.sw-bridge{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 66px);padding:2rem 1.5rem;text-align:center;}
.sw-bridge-inner{
  max-width:580px;animation:fadeUp .48s ease both;
  background:rgba(202,240,248,0.18);border:1px solid rgba(202,240,248,.4);
  border-radius:28px;padding:3rem 2.5rem;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:0 8px 32px rgba(3,4,94,.15);
}
.sw-bridge-icon{font-size:3.4rem;display:inline-block;animation:floatY 3s ease-in-out infinite;margin-bottom:1.1rem;}
.sw-bridge-title{font-family:'Sora',sans-serif;font-size:clamp(1.6rem,4vw,2.3rem);font-weight:800;color:#caf0f8;margin-bottom:.85rem;line-height:1.18;letter-spacing:-.02em;}
.sw-bridge-title .accent{color:#00b4d8;}
.sw-bridge-desc{font-family:'Space Grotesk',sans-serif;color:rgba(202,240,248,.8);font-size:.95rem;line-height:1.76;margin-bottom:1.8rem;}
.sw-bridge-steps{display:flex;justify-content:center;gap:0;margin-bottom:1.6rem;flex-wrap:wrap;}
.sw-bridge-step{display:flex;flex-direction:column;align-items:center;gap:.38rem;padding:0 1.1rem;position:relative;}
.sw-bridge-step+.sw-bridge-step::before{content:'→';position:absolute;left:-9px;top:10px;color:rgba(0,180,216,.5);font-size:.82rem;}
.sw-bridge-step-dot{width:32px;height:32px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-family:'Space Grotesk',sans-serif;font-weight:700;}
.sw-bridge-step-label{font-size:.62rem;color:rgba(202,240,248,.65);font-family:'Space Grotesk',sans-serif;font-weight:600;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;}

/* ─── Final ─── */
.sw-final{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 66px);padding:2rem 1.5rem;text-align:center;}
.sw-final-inner{
  max-width:560px;animation:fadeUp .48s ease both;
  background:rgba(202,240,248,0.18);border:1px solid rgba(202,240,248,.4);
  border-radius:28px;padding:3rem 2.5rem;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:0 8px 32px rgba(3,4,94,.15);
}
.sw-confetti{font-size:1.9rem;margin-bottom:.5rem;}
.sw-final-icon{font-size:3.4rem;display:inline-block;animation:floatY 3s ease-in-out infinite;margin-bottom:1rem;}
.sw-final-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#90e0ef;margin-bottom:.7rem;}
.sw-final-title{font-family:'Sora',sans-serif;font-size:clamp(1.5rem,4vw,2.3rem);font-weight:800;margin-bottom:.85rem;letter-spacing:-.02em;}
.sw-final-desc{font-family:'Space Grotesk',sans-serif;color:rgba(202,240,248,.8);font-size:.93rem;line-height:1.76;margin-bottom:2rem;}

/* ─── Spec / EE Result ─── */
.sw-spec-result{padding:2.5rem 1.5rem 5rem;}
.sw-spec-result-inner{max-width:900px;margin:0 auto;animation:fadeUp .48s ease both;}

/* ─── Responsive ─── */
@media(max-width:640px){
  .sw-nav{padding:1rem 1.2rem;}
  .sw-quiz-header{padding:1rem 1.2rem;}
  .sw-quiz-body{padding:1.4rem 1rem;}
  .sw-question-wrap{padding:1.8rem 1.2rem;}
  .sw-top-card{padding:1.35rem;}
  .sw-actions{flex-direction:column;}
  .sw-btn-primary,.sw-btn-outline,.sw-btn-ghost{width:100%;text-align:center;}
  .sw-hero{padding:4rem 1.2rem 6rem;}
  .sw-section{padding:3.5rem 1.2rem 5rem;}
  .sw-bridge-inner,.sw-final-inner{padding:2rem 1.4rem;}
}

/* ─── Auth Modal ─── */
.sw-modal-overlay{
  position:fixed;inset:0;z-index:999;
  background:rgba(0,4,30,0.65);
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;
  padding:1rem;animation:fadeUp .2s ease both;
}
.sw-modal{
  width:100%;max-width:420px;
  background:linear-gradient(160deg,rgba(3,4,94,0.92) 0%,rgba(0,77,122,0.95) 100%);
  border:1px solid rgba(0,180,216,0.35);
  border-radius:24px;padding:2.4rem 2rem;
  box-shadow:0 24px 80px rgba(0,0,0,0.5);
  position:relative;
}
.sw-modal-close{
  position:absolute;top:1.1rem;right:1.2rem;
  background:rgba(202,240,248,0.1);border:1px solid rgba(202,240,248,0.2);
  color:#caf0f8;border-radius:50%;width:30px;height:30px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:1rem;transition:background .2s;
}
.sw-modal-close:hover{background:rgba(202,240,248,0.2);}
.sw-modal-logo{font-family:'Sora',sans-serif;font-size:1.25rem;font-weight:800;color:#caf0f8;letter-spacing:-.02em;margin-bottom:1.6rem;}
.sw-modal-logo span{color:#00b4d8;}
.sw-modal-tabs{display:flex;gap:.5rem;margin-bottom:1.8rem;background:rgba(0,0,0,0.25);border-radius:100px;padding:.25rem;}
.sw-modal-tab{
  flex:1;font-family:'Space Grotesk',sans-serif;font-size:.85rem;font-weight:600;
  padding:.6rem;border-radius:100px;border:none;cursor:pointer;
  color:rgba(202,240,248,0.5);background:transparent;transition:all .2s;
}
.sw-modal-tab--active{background:#00b4d8;color:#03045e;}
.sw-modal-label{font-family:'Space Grotesk',sans-serif;font-size:.75rem;font-weight:600;color:rgba(202,240,248,.55);letter-spacing:.08em;text-transform:uppercase;margin-bottom:.45rem;display:block;}
.sw-modal-input{
  width:100%;background:rgba(202,240,248,0.08);
  border:1.5px solid rgba(202,240,248,0.18);border-radius:12px;
  padding:.85rem 1rem;color:#caf0f8;font-family:'Space Grotesk',sans-serif;font-size:.95rem;
  outline:none;transition:border-color .2s;margin-bottom:1rem;box-sizing:border-box;
}
.sw-modal-input:focus{border-color:#00b4d8;}
.sw-modal-input::placeholder{color:rgba(202,240,248,0.28);}
.sw-modal-error{
  background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.35);
  color:#fca5a5;border-radius:10px;padding:.7rem 1rem;
  font-family:'Space Grotesk',sans-serif;font-size:.83rem;
  margin-bottom:1rem;
}
.sw-modal-success{
  background:rgba(0,180,216,0.15);border:1px solid rgba(0,180,216,0.35);
  color:#67e8f9;border-radius:10px;padding:.7rem 1rem;
  font-family:'Space Grotesk',sans-serif;font-size:.83rem;
  margin-bottom:1rem;
}
.sw-modal-hint{font-family:'Space Grotesk',sans-serif;font-size:.78rem;color:rgba(202,240,248,.4);text-align:center;margin-top:1.1rem;}

/* ─── Navbar user section ─── */
.sw-nav-user{display:flex;align-items:center;gap:.65rem;}
.sw-nav-email{font-family:'Space Grotesk',sans-serif;font-size:.75rem;color:rgba(3,4,94,.65);font-weight:500;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.sw-nav-logout{
  font-family:'Space Grotesk',sans-serif;font-size:.72rem;font-weight:600;
  color:#0077b6;background:rgba(0,119,182,0.1);
  border:1px solid rgba(0,119,182,0.3);border-radius:100px;
  padding:.28rem .8rem;cursor:pointer;transition:all .2s;
}
.sw-nav-logout:hover{background:rgba(0,119,182,0.2);}

/* ─── Saving indicator ─── */
.sw-saving{
  position:fixed;bottom:1.5rem;right:1.5rem;z-index:500;
  background:rgba(0,180,216,0.2);border:1px solid rgba(0,180,216,0.4);
  color:#caf0f8;border-radius:100px;padding:.5rem 1.1rem;
  font-family:'Space Grotesk',sans-serif;font-size:.78rem;font-weight:600;
  display:flex;align-items:center;gap:.5rem;animation:fadeUp .3s ease;
}
.sw-saving-dot{width:7px;height:7px;border-radius:50%;background:#00b4d8;animation:blink 1s infinite;}
`;


/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════════ */
function calcScores(answers, questions, keys) {
  const scores = {};
  keys.forEach(k => (scores[k] = 0));
  answers.forEach((ansIdx, qi) => {
    const weights = questions[qi].opts[ansIdx].w;
    Object.entries(weights).forEach(([k, v]) => { scores[k] = (scores[k] || 0) + v; });
  });
  return scores;
}
function toPercent(scores) {
  const vals = Object.values(scores);
  const max = Math.max(...vals) || 1;
  const result = {};
  Object.entries(scores).forEach(([k, v]) => (result[k] = Math.round((v / max) * 100)));
  return result;
}
function calcCSSpecScores(answers) {
  const scores = {};
  Object.keys(CS_SPECS).forEach(k => (scores[k] = 0));
  CS_SPEC_QS.forEach((q, qi) => {
    const chosen = answers[q.id];
    if (!chosen) return;
    const idx = q.options.indexOf(chosen);
    if (idx === -1) return;
    const key = CS_WEIGHT_MAP[qi][idx];
    if (key && scores[key] !== undefined) scores[key] += 3;
  });
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const pct = {};
  Object.entries(scores).forEach(([k, v]) => (pct[k] = parseFloat(((v / total) * 100).toFixed(1))));
  return pct;
}
function calcEESpecScores(answers) {
  const scores = { ECE: 0, ECM: 0 };
  EE_SPEC_QS.forEach((q, qi) => {
    const chosen = answers[q.id];
    if (!chosen) return;
    const idx = q.options.indexOf(chosen);
    if (idx === -1) return;
    const weightObj = EE_WEIGHT_MAP[qi][idx];
    Object.entries(weightObj).forEach(([k, v]) => { scores[k] = (scores[k] || 0) + v; });
  });
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const pct = {};
  Object.entries(scores).forEach(([k, v]) => (pct[k] = parseFloat(((v / total) * 100).toFixed(1))));
  return pct;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SUPABASE HELPERS
═══════════════════════════════════════════════════════════════════════════════ */
async function dbCreateSession(userId) {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({ user_id: userId })
    .select()
    .single();
  if (error) console.error("Session create error:", error.message);
  return data?.id ?? null;
}

async function dbSaveResult(userId, sessionId, stage, scoresObj, pctObj, sorted, nameMap) {
  if (!userId || !sessionId) return;
  const { error } = await supabase.from("quiz_results").insert({
    user_id:        userId,
    session_id:     sessionId,
    stage,
    top_result_key:  sorted[0][0],
    top_result_name: nameMap[sorted[0][0]],
    runner_up_key:   sorted[1]?.[0] ?? null,
    runner_up_name:  sorted[1] ? nameMap[sorted[1][0]] : null,
    scores:          scoresObj,
    percentages:     pctObj,
  });
  if (error) console.error(`Save ${stage} result error:`, error.message);
}

async function dbLogEvent(userId, sessionId, eventType, eventData = {}) {
  if (!userId) return;
  await supabase.from("analytics_events").insert({
    user_id:    userId,
    session_id: sessionId ?? null,
    event_type: eventType,
    event_data: eventData,
  });
}

async function dbCompleteSession(sessionId) {
  if (!sessionId) return;
  await supabase.from("quiz_sessions").update({
    status:       "completed",
    completed_at: new Date().toISOString(),
  }).eq("id", sessionId);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   AUTH MODAL
═══════════════════════════════════════════════════════════════════════════════ */
function AuthModal({ onClose, onSuccess }) {
  const [tab, setTab]         = useState("signin");   // "signin" | "signup"
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [msg, setMsg]         = useState("");

  async function handleSubmit() {
    setError(""); setMsg("");
    if (!email.trim() || !password.trim()) { setError("Email aur password dono required hain."); return; }
    if (password.length < 6) { setError("Password kam se kam 6 characters ka hona chahiye."); return; }
    setLoading(true);

    if (tab === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (err) { setError(err.message); setLoading(false); return; }
      setMsg("Account created, please check mail.");
      setLoading(false);
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(), password,
      });
      if (err) { setError(err.message); setLoading(false); return; }
      setLoading(false);
      onSuccess(data.user);
    }
  }

  function handleKey(e) { if (e.key === "Enter") handleSubmit(); }

  return (
    <div className="sw-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sw-modal">
        <button className="sw-modal-close" onClick={onClose}>✕</button>
        <div className="sw-modal-logo">Speci<span>Wise</span></div>

        <div className="sw-modal-tabs">
          <button className={`sw-modal-tab${tab==="signin"?" sw-modal-tab--active":""}`} onClick={() => { setTab("signin"); setError(""); setMsg(""); }}>Sign In</button>
          <button className={`sw-modal-tab${tab==="signup"?" sw-modal-tab--active":""}`} onClick={() => { setTab("signup"); setError(""); setMsg(""); }}>Create Account</button>
        </div>

        {tab === "signup" && (
          <>
            <label className="sw-modal-label">Full Name</label>
            <input className="sw-modal-input" type="text" placeholder="your name" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} />
          </>
        )}
        <label className="sw-modal-label">Email</label>
        <input className="sw-modal-input" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} />
        <label className="sw-modal-label">Password</label>
        <input className="sw-modal-input" type="password" placeholder={tab==="signup"?"Min 6 characters":"••••••••"} value={password} onChange={e => setPass(e.target.value)} onKeyDown={handleKey} />

        {error && <div className="sw-modal-error">⚠️ {error}</div>}
        {msg   && <div className="sw-modal-success">✅ {msg}</div>}

        <button className="sw-btn-primary" style={{width:"100%",marginTop:".2rem"}} onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : tab==="signin" ? "Sign In & Begin →" : "Create Account →"}
        </button>
        <p className="sw-modal-hint">{tab==="signin" ? "New user? use Create Account " : "Already account, Switch to Sign In "}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   WAVE BACKGROUND
═══════════════════════════════════════════════════════════════════════════════ */
function WaveBg() {
  return (
    <div className="sw-bg">
      <div className="sw-waves">
        <div className="sw-wave-layer sw-wave-layer-1" />
        <div className="sw-wave-layer sw-wave-layer-2" />
        <div className="sw-wave-layer sw-wave-layer-3" />
        <div className="sw-wave-layer sw-wave-layer-4" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */
function Navbar({ badge, user, onLogout }) {
  return (
    <nav className="sw-nav">
      <div className="sw-logo">Speci<span>Wise</span></div>
      <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
        {badge && <span className="sw-nav-badge">{badge}</span>}
        {user && (
          <div className="sw-nav-user">
            <span className="sw-nav-email">{user.email}</span>
            <button className="sw-nav-logout" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function LandingPage({ onStart }) {
  const steps = [
    { num:"Step 01", icon:"🧭", title:"Domain Discovery", desc:"12 questions to surface which broad career domain fits your personality, interests, and thinking style." },
    { num:"Step 02", icon:"🔧", title:"Engineering Branch", desc:"For engineering-leaning students — 10 targeted questions to find the right branch for your profile." },
    { num:"Step 03", icon:"🎯", title:"Specialization Test", desc:"CS students unlock a 18-question CS spec test. EE students unlock a 12-question EE spec test. Pinpoint your exact niche." },
  ];
  const what = [
    { icon:"📊", title:"Your Top 2 Domains", desc:"Ranked by score so you can see all your options clearly." },
    { icon:"🗺️", title:"Career Roadmap", desc:"Courses, entrance exams, and timelines that matter." },
    { icon:"💡", title:"Strength Insights", desc:"See which skills and traits drive your match." },
    { icon:"⚙️", title:"Branch & Spec Match", desc:"For CS & EE — a pinpointed specialization within your branch." },
  ];
  const domainList = Object.values(DOMAINS).map(d => `${d.icon} ${d.name.split("&")[0].trim()}`);

  return (
    <div>
      {/* Hero */}
      <div className="sw-hero">
        <div className="sw-blob sw-blob-1" />
        <div className="sw-blob sw-blob-2" />
        <div className="sw-blob sw-blob-3" />

        <span className="sw-hero-eyebrow">Career Intelligence Platform</span>
        <h1 className="sw-hero-title">
          Discover Your<br />
          <span className="accent">Perfect Path</span>
        </h1>
        <p className="sw-hero-sub">
          A smart, multi-stage assessment system that guides students after 12th — from confusion to career clarity in under 20 minutes.
        </p>
        <div className="sw-hero-cta-wrap">
          <button className="sw-btn-primary" onClick={onStart}>Begin Assessment →</button>
        </div>
        <div className="sw-hero-stats">
          {[["3","Stages"],["7","Domains"],["2","Spec Tracks"],["20","Min"]].map(([n,l]) => (
            <div key={l} className="sw-stat">
              <span className="sw-stat-num">{n}</span>
              <span className="sw-stat-label">{l}</span>
            </div>
          ))}
        </div>
        <div className="sw-domain-peek">
          {domainList.map(d => <span key={d} className="sw-domain-chip">{d}</span>)}
        </div>
      </div>

      {/* Info */}
      <div className="sw-section">
        <div className="sw-section-header">
          <span className="sw-section-chip">How it works</span>
          <h2 className="sw-section-title">Three Stages, One Clear Direction</h2>
          <p className="sw-section-sub">Each stage builds on the last — building a precise, data-backed picture of your ideal career.</p>
        </div>
        <div className="sw-steps-grid">
          {steps.map((s, i) => (
            <div className="sw-step-card" key={i} style={{ animationDelay:`${i*.1}s` }}>
              <p className="sw-step-num">{s.num}</p>
              <span className="sw-step-icon">{s.icon}</span>
              <h3 className="sw-step-title">{s.title}</h3>
              <p className="sw-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="sw-section-header" style={{marginBottom:"1rem"}}>
          <span className="sw-section-chip">What you get</span>
          <h2 className="sw-section-title">Your Complete Career Blueprint</h2>
          <p className="sw-section-sub">A comprehensive, personalized recommendation tailored to who you actually are.</p>
        </div>
        <div className="sw-what-grid">
          {what.map((w, i) => (
            <div className="sw-what-card" key={i} style={{ animationDelay:`${i*.09}s` }}>
              <span className="sw-what-icon">{w.icon}</span>
              <div className="sw-what-text"><h4>{w.title}</h4><p>{w.desc}</p></div>
            </div>
          ))}
        </div>

        <div className="sw-cta-banner">
          <p className="sw-cta-title">Ready to find your direction?</p>
          <p className="sw-cta-sub">Takes ~15–20 minutes · No sign-up needed · Completely free</p>
          <button className="sw-btn-primary" onClick={onStart}>Begin Assessment →</button>
        </div>
      </div>
    </div>
  );
}

/* Generic Quiz for Domain & Branch (opts with .text) */
function Quiz({ questions, onFinish, title, label }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const letters = ["A","B","C","D"];
  const q = questions[current];
  const progress = (current / questions.length) * 100;

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (current + 1 < questions.length) {
      setAnswers(newAnswers); setSelected(null); setCurrent(c => c + 1);
    } else { setLoading(true); setTimeout(() => onFinish(newAnswers), 1500); }
  }

  if (loading) return (
    <div className="sw-quiz"><div className="sw-loading">
      <div className="sw-spinner"/>
      <p className="sw-loading-text">Analyzing your responses</p>
    </div></div>
  );

  return (
    <div className="sw-quiz">
      <div className="sw-progress-track"><div className="sw-progress-fill" style={{width:`${progress}%`}}/></div>
      <div className="sw-quiz-header">
        <span className="sw-quiz-title">{title}</span>
        <span className="sw-counter"><strong>{current+1}</strong> / {questions.length}</span>
      </div>
      <div className="sw-quiz-body">
        <div className="sw-question-wrap">
          <p className="sw-q-label">{label} · Question {current+1}</p>
          <h2 className="sw-q-text">{q.q}</h2>
          <div className="sw-options">
            {q.opts.map((opt, i) => (
              <button key={i} className={`sw-opt${selected===i?" sw-opt--selected":""}`} onClick={() => setSelected(i)}>
                <span className="sw-opt-letter">{letters[i]}</span>{opt.text}
              </button>
            ))}
          </div>
          <div style={{marginTop:"2rem",display:"flex",justifyContent:"flex-end"}}>
            <button className="sw-btn-primary" style={{background:"#caf0f8",color:"#03045e",boxShadow:"0 4px 20px rgba(202,240,248,.35)"}} onClick={handleNext} disabled={selected===null}>
              {current+1===questions.length?"Submit":"Next →"}
            </button>
          </div>
        </div>
      </div>
      <div className="sw-dots">
        {questions.map((_,i) => <div key={i} className={`sw-dot${i<current?" sw-dot--done":i===current?" sw-dot--active":""}`}/>)}
      </div>
    </div>
  );
}

/* CS Specialization Quiz (options are plain strings, auto-advance) */
function CSSpecQuiz({ onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const q = CS_SPEC_QS[current];
  const progress = (current / CS_SPEC_QS.length) * 100;
  const letters = ["A","B","C","D","E"];

  function handleAnswer(option) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => {
      const updated = { ...answers, [CS_SPEC_QS[current].id]: option };
      setAnswers(updated); setSelected(null);
      if (current+1 < CS_SPEC_QS.length) { setCurrent(c=>c+1); }
      else { setLoading(true); setTimeout(() => onFinish(calcCSSpecScores(updated)), 1500); }
    }, 360);
  }

  if (loading) return (
    <div className="sw-quiz"><div className="sw-loading">
      <div className="sw-spinner"/>
      <p className="sw-loading-text">Building your CS profile</p>
    </div></div>
  );

  return (
    <div className="sw-quiz">
      <div className="sw-progress-track"><div className="sw-progress-fill" style={{width:`${progress}%`}}/></div>
      <div className="sw-quiz-header">
        <span className="sw-quiz-title">CS Specialization Test</span>
        <span className="sw-counter"><strong>{current+1}</strong> / {CS_SPEC_QS.length}</span>
      </div>
      <div className="sw-quiz-body">
        <div className="sw-question-wrap">
          <p className="sw-q-label">CS Specialization · Question {current+1}</p>
          <h2 className="sw-q-text">{q.text}</h2>
          <div className="sw-options">
            {q.options.map((opt, i) => (
              <button key={opt} className={`sw-opt${selected===opt?" sw-opt--selected":""}`} style={{animationDelay:`${i*.05}s`}} onClick={() => handleAnswer(opt)}>
                <span className="sw-opt-letter">{letters[i]}</span>{opt}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="sw-dots">
        {CS_SPEC_QS.map((_,i) => <div key={i} className={`sw-dot${i<current?" sw-dot--done":i===current?" sw-dot--active":""}`}/>)}
      </div>
    </div>
  );
}

/* EE Specialization Quiz */
function EESpecQuiz({ onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const q = EE_SPEC_QS[current];
  const progress = (current / EE_SPEC_QS.length) * 100;
  const letters = ["A","B","C","D","E"];

  function handleAnswer(option) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => {
      const updated = { ...answers, [EE_SPEC_QS[current].id]: option };
      setAnswers(updated); setSelected(null);
      if (current+1 < EE_SPEC_QS.length) { setCurrent(c=>c+1); }
      else { setLoading(true); setTimeout(() => onFinish(calcEESpecScores(updated)), 1500); }
    }, 360);
  }

  if (loading) return (
    <div className="sw-quiz"><div className="sw-loading">
      <div className="sw-spinner"/>
      <p className="sw-loading-text">Analyzing your EE profile</p>
    </div></div>
  );

  return (
    <div className="sw-quiz">
      <div className="sw-progress-track"><div className="sw-progress-fill" style={{width:`${progress}%`}}/></div>
      <div className="sw-quiz-header">
        <span className="sw-quiz-title">EE Specialization Test</span>
        <span className="sw-counter"><strong>{current+1}</strong> / {EE_SPEC_QS.length}</span>
      </div>
      <div className="sw-quiz-body">
        <div className="sw-question-wrap">
          <p className="sw-q-label">EE Specialization · Question {current+1}</p>
          <h2 className="sw-q-text">{q.text}</h2>
          <div className="sw-options">
            {q.options.map((opt, i) => (
              <button key={opt} className={`sw-opt${selected===opt?" sw-opt--selected":""}`} style={{animationDelay:`${i*.05}s`}} onClick={() => handleAnswer(opt)}>
                <span className="sw-opt-letter">{letters[i]}</span>{opt}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="sw-dots">
        {EE_SPEC_QS.map((_,i) => <div key={i} className={`sw-dot${i<current?" sw-dot--done":i===current?" sw-dot--active":""}`}/>)}
      </div>
    </div>
  );
}

/* Domain Result */
function DomainResult({ answers, onContinue, onRestart }) {
  const scores = calcScores(answers, DOMAIN_QS, Object.keys(DOMAINS));
  const pct = toPercent(scores);
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const [topKey, top2Key] = [sorted[0][0], sorted[1][0]];
  const top = DOMAINS[topKey]; const runner = DOMAINS[top2Key];
  const hasEng = topKey==="ENG" || top2Key==="ENG";

  return (
    <div className="sw-result"><div className="sw-result-inner">
      <p className="sw-result-eyebrow">Domain Discovery — Results</p>
      <h2 className="sw-result-title">Your Top Domain Match</h2>

      <div className="sw-top-card" style={{background:`rgba(202,240,248,0.2)`,borderColor:`rgba(0,180,216,0.4)`}}>
        <div className="sw-top-shine" style={{background:`linear-gradient(90deg,${top.color},transparent)`}}/>
        <div className="sw-top-body">
          <span className="sw-top-icon">{top.icon}</span>
          <div className="sw-top-info">
            <p className="sw-top-eyebrow" style={{color:top.color}}>#1 Match — {pct[topKey]}% Alignment</p>
            <h3 className="sw-top-name">{top.name}</h3>
            <p className="sw-top-tagline" style={{color:top.color}}>{top.tagline}</p>
            <p className="sw-top-desc">{top.desc}</p>
            <div className="sw-careers">{top.careers.map(c=><span key={c} className="sw-career-tag" style={{color:top.color,borderColor:top.border}}>{c}</span>)}</div>
            <div className="sw-badges-row">{top.badges.map(b=><span key={b} className="sw-badge">{b}</span>)}</div>
          </div>
        </div>
      </div>

      <div className="sw-grid-2">
        <div className="sw-panel">
          <p className="sw-panel-title">🥈 Runner-Up Domain</p>
          <div style={{display:"flex",gap:"1rem",alignItems:"flex-start",marginBottom:".7rem"}}>
            <span style={{fontSize:"1.75rem"}}>{runner.icon}</span>
            <div>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:".97rem",fontWeight:700,color:runner.color,marginBottom:".18rem"}}>{runner.name}</p>
              <p style={{fontSize:".82rem",color:"#023e5a"}}>{runner.tagline}</p>
              <p style={{fontSize:".73rem",color:"rgba(202,240,248,.65)",fontFamily:"'Space Grotesk',sans-serif",marginTop:".28rem"}}>{pct[top2Key]}% alignment</p>
            </div>
          </div>
          <p style={{fontSize:".83rem",color:"#023e5a",lineHeight:1.68}}>{runner.desc.slice(0,130)}...</p>
        </div>
        <div className="sw-panel">
          <p className="sw-panel-title">📊 Full Domain Rankings</p>
          <div className="sw-rankings">
            {sorted.map(([k])=>{ const d=DOMAINS[k]; return (
              <div key={k} className="sw-rank-row">
                <div className="sw-rank-label"><span>{d.icon} {d.name.split("&")[0].trim()}</span><span className="sw-rank-pct" style={{color:d.color}}>{pct[k]}%</span></div>
                <div className="sw-bar-track"><div className="sw-bar-fill" style={{width:`${pct[k]}%`,background:d.color}}/></div>
              </div>
            );})}
          </div>
        </div>
      </div>

      {hasEng && (
        <div className="sw-eng-banner">
          <p className="sw-eng-banner-label">⚙️ Engineering Path Unlocked</p>
          <p className="sw-eng-banner-title">Engineering is in your top matches!</p>
          <p className="sw-eng-banner-desc">Take the Branch Test next to discover which engineering branch fits you best — CS, Mechanical, Electrical, Civil, Chemical, or Biotechnology.</p>
        </div>
      )}

      <div className="sw-actions">
        {hasEng && <button className="sw-btn-primary" onClick={()=>onContinue("branch")}>Take Engineering Branch Test →</button>}
        <button className={hasEng?"sw-btn-outline":"sw-btn-primary"} onClick={()=>onContinue("final")}>
          {hasEng?"Skip to Career Summary":"View Career Summary →"}
        </button>
        <button className="sw-btn-ghost" onClick={onRestart}>Retake Domain Test</button>
      </div>
    </div></div>
  );
}

/* Branch Result */
function BranchResult({ answers, onContinue, onRestart }) {
  const scores = calcScores(answers, BRANCH_QS, Object.keys(BRANCHES));
  const pct = toPercent(scores);
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const topKey = sorted[0][0]; const top = BRANCHES[topKey];
  const isCS = topKey==="CS"; const isEE = topKey==="EE";

  return (
    <div className="sw-result"><div className="sw-result-inner">
      <p className="sw-result-eyebrow">Engineering Branch — Results</p>
      <h2 className="sw-result-title">Your Best-Fit Branch</h2>

      <div className="sw-top-card" style={{background:"rgba(202,240,248,0.18)",borderColor:"rgba(0,180,216,0.38)"}}>
        <div className="sw-top-shine" style={{background:`linear-gradient(90deg,${top.color},transparent)`}}/>
        <div className="sw-top-body">
          <span className="sw-top-icon">{top.icon}</span>
          <div className="sw-top-info">
            <p className="sw-top-eyebrow" style={{color:top.color}}>Top Branch — {pct[topKey]}% Fit Score</p>
            <h3 className="sw-top-name">{top.name}</h3>
            <p className="sw-top-tagline" style={{color:top.color}}>{top.tagline}</p>
            <div className="sw-careers" style={{marginTop:".75rem"}}>
              {top.careers.map(c=><span key={c} className="sw-career-tag" style={{color:top.color,borderColor:`${top.color}40`}}>{c}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="sw-grid-2">
        <div className="sw-panel">
          <p className="sw-panel-title">📊 Branch Rankings</p>
          <div className="sw-rankings">
            {sorted.map(([k])=>{ const b=BRANCHES[k]; return (
              <div key={k} className="sw-rank-row">
                <div className="sw-rank-label"><span>{b.icon} {b.name.split("&")[0].trim()}</span><span className="sw-rank-pct" style={{color:b.color}}>{pct[k]}%</span></div>
                <div className="sw-bar-track"><div className="sw-bar-fill" style={{width:`${pct[k]}%`,background:b.color}}/></div>
              </div>
            );})}
          </div>
        </div>
        <div className="sw-panel">
          <p className="sw-panel-title">🎯 {(isCS||isEE)?"Final Step: Specialization":"Your Journey"}</p>
          <p style={{color:"#023e5a",fontSize:".87rem",lineHeight:1.72,marginBottom:".95rem"}}>
            {isCS ? <>Matched to <strong style={{color:"#03045e"}}>{top.name}</strong>. The CS Specialization Test will identify your exact sub-field — AI, Cloud, Security, Core CS, and more.</> :
             isEE ? <>Matched to <strong style={{color:"#03045e"}}>{top.name}</strong>. The EE Specialization Test will identify whether you're better suited for Electronics & Communication or Electronics & Computer Engineering.</> :
             <>Matched to <strong style={{color:"#03045e"}}>{top.name}</strong>. Head to Career Summary to see your complete profile.</>}
          </p>
          {["Domain → Identified ✓","Branch → Identified ✓",(isCS||isEE)?"Specialization → Up Next":"Career Summary → Up Next"].map((step,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:".6rem",padding:".45rem .72rem",borderRadius:"8px",background:i<2?"rgba(0,119,182,.12)":"rgba(202,240,248,.08)",border:`1px solid ${i<2?"rgba(0,180,216,.28)":"rgba(202,240,248,.18)"}`,fontSize:".78rem",fontFamily:"'Space Grotesk',sans-serif",color:i<2?"#00b4d8":"rgba(202,240,248,.6)",marginBottom:".38rem"}}>
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className="sw-actions">
        {isCS && <button className="sw-btn-primary" onClick={()=>onContinue("cs-spec")}>Continue to CS Specialization →</button>}
        {isEE && <button className="sw-btn-primary" onClick={()=>onContinue("ee-spec")}>Continue to EE Specialization →</button>}
        {!isCS && !isEE && <button className="sw-btn-primary" onClick={()=>onContinue("final")}>View Career Summary →</button>}
        <button className="sw-btn-ghost" onClick={onRestart}>Retake Branch Test</button>
      </div>
    </div></div>
  );
}

/* Bridge screen — generic */
function SpecBridge({ icon, branchName, specLabel, steps, specChips, onStart, onRestart }) {
  return (
    <div className="sw-bridge"><div className="sw-bridge-inner">
      <span className="sw-bridge-icon">{icon}</span>
      <p style={{fontSize:".62rem",fontWeight:700,letterSpacing:".22em",textTransform:"uppercase",color:"#90e0ef",fontFamily:"'Space Grotesk',sans-serif",marginBottom:".7rem"}}>{branchName}</p>
      <h2 className="sw-bridge-title">One Last Step —<br /><span className="accent">{specLabel}</span></h2>
      <p className="sw-bridge-desc">You've identified your domain and branch. Now SpeciWise will pinpoint your exact specialization within <strong style={{color:"#caf0f8"}}>{branchName}</strong> using our weighted interest model.</p>
      <div className="sw-bridge-steps">
        {steps.map((s,i)=>(
          <div key={i} className="sw-bridge-step">
            <div className="sw-bridge-step-dot" style={{borderColor:s.done?"#00b4d8":"rgba(202,240,248,.25)",background:s.done?"rgba(0,180,216,.15)":"transparent",color:s.done?"#00b4d8":"rgba(202,240,248,.4)"}}>
              {s.done?"✓":"→"}
            </div>
            <span className="sw-bridge-step-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:".4rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.8rem"}}>
        {specChips.map(s=>(
          <span key={s.name} style={{background:"rgba(0,119,182,0.2)",border:"1px solid rgba(0,180,216,0.3)",color:"#caf0f8",padding:".26rem .72rem",borderRadius:"100px",fontSize:".72rem",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>
            {s.icon} {s.name}
          </span>
        ))}
      </div>
      <div className="sw-actions" style={{justifyContent:"center"}}>
        <button className="sw-btn-primary" onClick={onStart}>Start {specLabel} →</button>
        <button className="sw-btn-ghost" onClick={onRestart}>Start Over</button>
      </div>
    </div></div>
  );
}

/* CS Spec Result */
function CSSpecResult({ specScores, onRestart }) {
  const sorted = Object.entries(specScores).sort((a,b)=>b[1]-a[1]);
  const maxVal = sorted[0]?.[1] || 1;
  const topKey = sorted[0]?.[0];
  const topSpec = topKey ? CS_SPECS[topKey] : null;
  if (!topSpec) return null;

  return (
    <div className="sw-spec-result"><div className="sw-spec-result-inner">
      <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
        <p className="sw-result-eyebrow">CS Specialization — Your Results</p>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(1.6rem,4vw,2.5rem)",fontWeight:800,color:"#caf0f8",letterSpacing:"-.02em"}}>You're a perfect fit for</h1>
      </div>
      <div className="sw-top-card" style={{background:"rgba(0,119,182,0.15)",borderColor:"rgba(0,180,216,0.4)"}}>
        <div className="sw-top-shine" style={{background:`linear-gradient(90deg,${topSpec.color},transparent)`}}/>
        <div className="sw-top-body">
          <span className="sw-top-icon">{topSpec.icon}</span>
          <div className="sw-top-info">
            <p className="sw-top-eyebrow" style={{color:topSpec.color}}>Top Match · {sorted[0][1].toFixed(1)}%</p>
            <h2 className="sw-top-name">{topSpec.name}</h2>
            <p className="sw-top-tagline" style={{color:topSpec.color}}>"{topSpec.tagline}"</p>
            <p className="sw-top-desc">{topSpec.desc}</p>
            <div className="sw-careers">{topSpec.careers.map(c=><span key={c} className="sw-career-tag" style={{background:"rgba(0,119,182,0.2)",borderColor:"rgba(0,180,216,0.35)",color:"#caf0f8"}}>{c}</span>)}</div>
          </div>
        </div>
      </div>
      <div className="sw-grid-2">
        <div className="sw-panel">
          <p className="sw-panel-title">📊 All Specialization Rankings</p>
          <div className="sw-rankings">
            {sorted.map(([key,val],i)=>{ const sp=CS_SPECS[key]; if(!sp) return null; return (
              <div key={key} className="sw-rank-row">
                <div className="sw-rank-label"><span style={{color:i===0?"#caf0f8":"rgba(202,240,248,.65)",fontWeight:i===0?700:400}}>{sp.icon} {sp.name}</span><span className="sw-rank-pct" style={{color:sp.color}}>{val.toFixed(1)}%</span></div>
                <div className="sw-bar-track"><div className="sw-bar-fill" style={{width:`${(val/maxVal)*100}%`,background:sp.color}}/></div>
              </div>
            );})}
          </div>
        </div>
        {sorted[1] && CS_SPECS[sorted[1][0]] && (
          <div className="sw-panel">
            <p className="sw-panel-title">🥈 Your #2 Specialization</p>
            <div style={{display:"flex",gap:"1rem",alignItems:"flex-start"}}>
              <span style={{fontSize:"1.9rem"}}>{CS_SPECS[sorted[1][0]].icon}</span>
              <div>
                <p style={{fontFamily:"'Sora',sans-serif",fontSize:".97rem",fontWeight:700,color:CS_SPECS[sorted[1][0]].color,marginBottom:".2rem"}}>{CS_SPECS[sorted[1][0]].name}</p>
                <p style={{fontSize:".82rem",color:"rgba(202,240,248,.65)",marginBottom:".45rem"}}>{CS_SPECS[sorted[1][0]].tagline}</p>
                <p style={{fontSize:".83rem",color:"#023e5a",lineHeight:1.68}}>{CS_SPECS[sorted[1][0]].desc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center"}}><button className="sw-btn-primary" onClick={onRestart}>Start Over</button></div>
    </div></div>
  );
}

/* EE Spec Result */
function EESpecResult({ specScores, onRestart }) {
  const sorted = Object.entries(specScores).sort((a,b)=>b[1]-a[1]);
  const topKey = sorted[0]?.[0];
  const topSpec = topKey ? EE_SPECS[topKey] : null;
  const runnerKey = sorted[1]?.[0];
  const runnerSpec = runnerKey ? EE_SPECS[runnerKey] : null;
  if (!topSpec) return null;

  return (
    <div className="sw-spec-result"><div className="sw-spec-result-inner">
      <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
        <p className="sw-result-eyebrow">EE Specialization — Your Results</p>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(1.6rem,4vw,2.5rem)",fontWeight:800,color:"#caf0f8",letterSpacing:"-.02em"}}>Your EE Specialization</h1>
      </div>
      <div className="sw-top-card" style={{background:"rgba(0,119,182,0.15)",borderColor:"rgba(0,180,216,0.4)"}}>
        <div className="sw-top-shine" style={{background:`linear-gradient(90deg,${topSpec.color},transparent)`}}/>
        <div className="sw-top-body">
          <span className="sw-top-icon">{topSpec.icon}</span>
          <div className="sw-top-info">
            <p className="sw-top-eyebrow" style={{color:topSpec.color}}>Top Match · {sorted[0][1].toFixed(1)}%</p>
            <h2 className="sw-top-name">{topSpec.name}</h2>
            <p className="sw-top-tagline" style={{color:topSpec.color}}>"{topSpec.tagline}"</p>
            <p className="sw-top-desc">{topSpec.desc}</p>
            <div className="sw-careers">{topSpec.careers.map(c=><span key={c} className="sw-career-tag" style={{background:"rgba(0,119,182,0.2)",borderColor:"rgba(0,180,216,0.35)",color:"#caf0f8"}}>{c}</span>)}</div>
          </div>
        </div>
      </div>

      {/* Comparison bar */}
      <div className="sw-panel" style={{marginBottom:"1.4rem"}}>
        <p className="sw-panel-title">📊 ECE vs ECM — Your Fit</p>
        <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
          {sorted.map(([key,val])=>{ const sp=EE_SPECS[key]; return (
            <div key={key}>
              <div className="sw-rank-label" style={{marginBottom:".45rem"}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontWeight:700,color:"#caf0f8",fontSize:".88rem"}}>{sp.icon} {sp.name}</span>
                <span style={{color:sp.color,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:".88rem"}}>{val.toFixed(1)}%</span>
              </div>
              <div className="sw-bar-track" style={{height:"10px",borderRadius:"6px"}}>
                <div className="sw-bar-fill" style={{width:`${val}%`,background:`linear-gradient(90deg,${sp.color},#00b4d8)`,height:"100%",borderRadius:"6px"}}/>
              </div>
              <p style={{fontSize:".78rem",color:"rgba(202,240,248,.6)",fontFamily:"'Space Grotesk',sans-serif",marginTop:".4rem"}}>{sp.tagline}</p>
            </div>
          );})}
        </div>
      </div>

      {runnerSpec && (
        <div className="sw-panel" style={{marginBottom:"1.4rem"}}>
          <p className="sw-panel-title">About {runnerSpec.name}</p>
          <div style={{display:"flex",gap:"1rem",alignItems:"flex-start"}}>
            <span style={{fontSize:"2rem"}}>{runnerSpec.icon}</span>
            <div>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:".97rem",fontWeight:700,color:runnerSpec.color,marginBottom:".2rem"}}>{runnerSpec.name}</p>
              <p style={{fontSize:".83rem",color:"#023e5a",lineHeight:1.68}}>{runnerSpec.desc}</p>
              <div style={{display:"flex",gap:".38rem",flexWrap:"wrap",marginTop:".6rem"}}>
                {runnerSpec.careers.map(c=><span key={c} style={{background:"rgba(0,119,182,0.15)",border:"1px solid rgba(0,180,216,0.25)",color:"#caf0f8",padding:".22rem .62rem",borderRadius:"100px",fontSize:".7rem",fontFamily:"'Space Grotesk',sans-serif"}}>{c}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{textAlign:"center"}}><button className="sw-btn-primary" onClick={onRestart}>Start Over</button></div>
    </div></div>
  );
}

/* Final Result (non-engineering path) */
function FinalResult({ domainAnswers, onRestart, onMount }) {
  useEffect(() => { if (onMount) onMount(); }, []); // eslint-disable-line
  const scores = calcScores(domainAnswers, DOMAIN_QS, Object.keys(DOMAINS));
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const top = DOMAINS[sorted[0][0]];
  return (
    <div className="sw-final"><div className="sw-final-inner">
      <p className="sw-confetti">🎉</p>
      <span className="sw-final-icon">{top.icon}</span>
      <p className="sw-final-eyebrow">Your Best Domain Match</p>
      <h2 className="sw-final-title" style={{color:top.color}}>{top.name}</h2>
      <p style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:".93rem",color:top.color,fontWeight:500,marginBottom:".75rem"}}>{top.tagline}</p>
      <p className="sw-final-desc">{top.desc}</p>
      <div style={{display:"flex",gap:".38rem",flexWrap:"wrap",justifyContent:"center",marginBottom:"1.5rem"}}>
        {top.careers.map(c=><span key={c} className="sw-career-tag" style={{color:top.color,borderColor:top.border}}>{c}</span>)}
      </div>
      <div className="sw-badges-row" style={{justifyContent:"center",marginBottom:"2rem"}}>
        {top.badges.map(b=><span key={b} className="sw-badge">{b}</span>)}
      </div>
      <button className="sw-btn-primary" onClick={onRestart}>Retake the Test</button>
    </div></div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════════════════ */
const BRIDGE_STEPS = [
  { label:"Domain", done:true },
  { label:"Branch", done:true },
  { label:"Spec",   done:false },
];

export default function SpeciWiseApp() {
  /* ── UI state ── */
  const [page,          setPage]          = useState("landing");
  const [saving,        setSaving]        = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  /* ── Auth state ── */
  const [user,          setUser]          = useState(null);
  const [authReady,     setAuthReady]     = useState(false);

  /* ── Quiz data state ── */
  const [domainAnswers, setDomainAnswers] = useState([]);
  const [branchAnswers, setBranchAnswers] = useState([]);
  const [csSpecScores,  setCsSpecScores]  = useState(null);
  const [eeSpecScores,  setEeSpecScores]  = useState(null);

  /* ── Session tracking ── */
  const [quizSessionId, setQuizSessionId] = useState(null);

  /* ── Auth listener on mount ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Logout ── */
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setPage("landing");
    setDomainAnswers([]); setBranchAnswers([]);
    setCsSpecScores(null); setEeSpecScores(null);
    setQuizSessionId(null);
  }

  /* ── Start quiz: requires auth ── */
  async function handleStart() {
    if (!user) { setShowAuthModal(true); return; }
    const sid = await dbCreateSession(user.id);
    setQuizSessionId(sid);
    await dbLogEvent(user.id, sid, "quiz_started");
    setPage("domain-quiz");
  }

  /* ── Auth success callback from modal ── */
  async function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
    setShowAuthModal(false);
    const sid = await dbCreateSession(loggedInUser.id);
    setQuizSessionId(sid);
    await dbLogEvent(loggedInUser.id, sid, "quiz_started");
    setPage("domain-quiz");
  }

  /* ── Domain quiz finish ── */
  async function handleDomainFinish(a) {
    setDomainAnswers(a);
    setSaving(true);
    const scores = calcScores(a, DOMAIN_QS, Object.keys(DOMAINS));
    const pct    = toPercent(scores);
    const sorted = Object.entries(scores).sort((x,y) => y[1]-x[1]);
    const nameMap = Object.fromEntries(Object.entries(DOMAINS).map(([k,v]) => [k, v.name]));
    await dbSaveResult(user?.id, quizSessionId, "domain", scores, pct, sorted, nameMap);
    await dbLogEvent(user?.id, quizSessionId, "stage_completed", { stage:"domain", top: sorted[0][0] });
    setSaving(false);
    setPage("domain-result");
  }

  /* ── Branch quiz finish ── */
  async function handleBranchFinish(a) {
    setBranchAnswers(a);
    setSaving(true);
    const scores = calcScores(a, BRANCH_QS, Object.keys(BRANCHES));
    const pct    = toPercent(scores);
    const sorted = Object.entries(scores).sort((x,y) => y[1]-x[1]);
    const nameMap = Object.fromEntries(Object.entries(BRANCHES).map(([k,v]) => [k, v.name]));
    await dbSaveResult(user?.id, quizSessionId, "branch", scores, pct, sorted, nameMap);
    await dbLogEvent(user?.id, quizSessionId, "stage_completed", { stage:"branch", top: sorted[0][0] });
    setSaving(false);
    setPage("branch-result");
  }

  /* ── CS Spec finish ── */
  async function handleCSSpecFinish(s) {
    setCsSpecScores(s);
    setSaving(true);
    const sorted  = Object.entries(s).sort((x,y) => y[1]-x[1]);
    const nameMap = Object.fromEntries(Object.entries(CS_SPECS).map(([k,v]) => [k, v.name]));
    const rawScores = Object.fromEntries(sorted.map(([k,v]) => [k, parseFloat(v)]));
    await dbSaveResult(user?.id, quizSessionId, "cs_spec", rawScores, rawScores, sorted, nameMap);
    await dbLogEvent(user?.id, quizSessionId, "stage_completed", { stage:"cs_spec", top: sorted[0][0] });
    setSaving(false);
    setPage("cs-result");
  }

  /* ── EE Spec finish ── */
  async function handleEESpecFinish(s) {
    setEeSpecScores(s);
    setSaving(true);
    const sorted  = Object.entries(s).sort((x,y) => y[1]-x[1]);
    const nameMap = Object.fromEntries(Object.entries(EE_SPECS).map(([k,v]) => [k, v.name]));
    const rawScores = Object.fromEntries(sorted.map(([k,v]) => [k, parseFloat(v)]));
    await dbSaveResult(user?.id, quizSessionId, "ee_spec", rawScores, rawScores, sorted, nameMap);
    await dbLogEvent(user?.id, quizSessionId, "stage_completed", { stage:"ee_spec", top: sorted[0][0] });
    setSaving(false);
    setPage("ee-result");
  }

  /* ── Final page reached ── */
  async function handleFinalReached() {
    await dbCompleteSession(quizSessionId);
    await dbLogEvent(user?.id, quizSessionId, "quiz_completed");
    setPage("final");
  }

  /* ── Restart ── */
  function restart() {
    setPage("landing"); setDomainAnswers([]); setBranchAnswers([]);
    setCsSpecScores(null); setEeSpecScores(null); setQuizSessionId(null);
  }

  const navBadges = {
    landing:null,"domain-quiz":"Domain Test","domain-result":"Domain Test",
    "branch-quiz":"Branch Test","branch-result":"Branch Test",
    "cs-bridge":"CS Specialization","cs-quiz":"CS Specialization","cs-result":"CS Specialization",
    "ee-bridge":"EE Specialization","ee-quiz":"EE Specialization","ee-result":"EE Specialization",
    final:"Your Results",
  };

  if (!authReady) return (
    <>
      <style>{CSS}</style>
      <div className="sw-app">
        <WaveBg />
        <div className="sw-page">
          <div className="sw-loading" style={{minHeight:"100vh"}}>
            <div className="sw-spinner"/>
            <p className="sw-loading-text">Loading SpeciWise</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="sw-app">
        <WaveBg />
        <div className="sw-page">
          <Navbar badge={navBadges[page]} user={user} onLogout={handleLogout} />

          {page==="landing"       && <LandingPage onStart={handleStart} />}
          {page==="domain-quiz"   && <Quiz questions={DOMAIN_QS} title="Domain Discovery Test" label="Domain" onFinish={handleDomainFinish} />}
          {page==="domain-result" && <DomainResult answers={domainAnswers} onContinue={n => setPage(n==="branch"?"branch-quiz":"final")} onRestart={() => { setDomainAnswers([]); setPage("domain-quiz"); }} />}
          {page==="branch-quiz"   && <Quiz questions={BRANCH_QS} title="Engineering Branch Test" label="Branch" onFinish={handleBranchFinish} />}
          {page==="branch-result" && <BranchResult answers={branchAnswers} onContinue={n => setPage(n==="cs-spec"?"cs-bridge":n==="ee-spec"?"ee-bridge":"final")} onRestart={() => { setBranchAnswers([]); setPage("branch-quiz"); }} />}

          {page==="cs-bridge" && (
            <SpecBridge
              icon="💻" branchName="Computer Science & IT" specLabel="CS Specialization Test"
              steps={BRIDGE_STEPS}
              specChips={Object.values(CS_SPECS).map(s=>({icon:s.icon,name:s.name}))}
              onStart={() => setPage("cs-quiz")} onRestart={restart}
            />
          )}
          {page==="cs-quiz"   && <CSSpecQuiz onFinish={handleCSSpecFinish} />}
          {page==="cs-result" && csSpecScores && <CSSpecResult specScores={csSpecScores} onRestart={restart} />}

          {page==="ee-bridge" && (
            <SpecBridge
              icon="⚡" branchName="Electrical & Electronics" specLabel="EE Specialization Test"
              steps={BRIDGE_STEPS}
              specChips={Object.values(EE_SPECS).map(s=>({icon:s.icon,name:s.name}))}
              onStart={() => setPage("ee-quiz")} onRestart={restart}
            />
          )}
          {page==="ee-quiz"   && <EESpecQuiz onFinish={handleEESpecFinish} />}
          {page==="ee-result" && eeSpecScores && <EESpecResult specScores={eeSpecScores} onRestart={restart} />}

          {page==="final" && <FinalResult domainAnswers={domainAnswers} onRestart={restart} onMount={handleFinalReached} />}
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="sw-saving">
            <div className="sw-saving-dot"/>
            Saving results...
          </div>
        )}

        {/* Auth modal */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </>
  );
}

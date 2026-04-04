<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeCraft | Creative Portfolio</title>
    <style>
        /* --- CSS Variables & Reset --- */
        :root {
            --bg-color: #0a0a0a;
            --text-color: #ffffff;
            --accent-color: #00f2ff;
            --accent-secondary: #7000ff;
            --card-bg: #161616;
            --font-main: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-main);
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            overflow-x: hidden;
        }

        a { text-decoration: none; color: inherit; transition: 0.3s; }
        ul { list-style: none; }

        /* --- Header & Nav --- */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 5%;
            position: fixed;
            width: 100%;
            top: 0;
            background: rgba(10, 10, 10, 0.8);
            backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 1px;
            color: var(--accent-color);
        }

        nav ul {
            display: flex;
            gap: 30px;
        }

        nav a:hover {
            color: var(--accent-color);
        }

        /* --- Hero Section --- */
        .hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            padding: 0 20px;
        }

        /* Animated Gradient Background */
        .gradient-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(-45deg, #000000, #1a1a2e, #16213e, #0f3460);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            z-index: -1;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .hero h1 {
            font-size: 4rem;
            margin-bottom: 10px;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 1.2rem;
            max-width: 600px;
            color: #ccc;
            margin-bottom: 30px;
        }

        .btn {
            padding: 12px 30px;
            background: transparent;
            border: 2px solid var(--accent-color);
            color: var(--accent-color);
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .btn:hover {
            background: var(--accent-color);
            color: #000;
            box-shadow: 0 0 15px var(--accent-color);
        }

        /* --- Projects Section --- */
        .container {
            padding: 80px 5%;
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background: var(--card-bg);
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 242, 255, 0.1);
            border-color: var(--accent-color);
        }

        .card-image {
            width: 100%;
            height: 200px;
            background: #222;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
            font-size: 3rem;
        }
        
        /* Placeholder styling for images */
        .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .card-content {
            padding: 20px;
        }

        .card-content h3 {
            margin-bottom: 10px;
            color: var(--accent-color);
        }

        .card-content p {
            font-size: 0.9rem;
            color: #aaa;
            margin-bottom: 20px;
        }

        .card-link {
            color: var(--accent-color);
            font-weight: bold;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .card-link:hover {
            text-decoration: underline;
        }

        /* --- Contact Section --- */
        .contact {
            background: #111;
            text-align: center;
        }

        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        input, textarea {
            padding: 15px;
            background: #222;
            border: 1px solid #333;
            color: white;
            border-radius: 5px;
            font-family: inherit;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: var(--accent-color);
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        /* --- Footer --- */
        footer {
            text-align: center;
            padding: 40px;
            border-top: 1px solid #333;
            color: #666;
            font-size: 0.9rem;
        }

        /* --- Responsive --- */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            nav ul { display: none; } /* Simplified for demo */
            .gradient-bg { background-position: 0% 0%; }
        }
    </style>
</head>
<body>

    <header>
        <div class="logo">&lt;CodeCraft /&gt;</div>
        <nav>
            <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#projects">Work</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section id="hero" class="hero">
        <div class="gradient-bg"></div>
        <div class="gradient-bg" style="background: linear-gradient(-45deg, #ff00cc, #333399); animation-delay: -5s;"></div>
        
        <h1>Building Digital Experiences</h1>
        <p>I'm a creative coder crafting interactive web interfaces, animations, and immersive layouts.</p>
        <a href="#projects" class="btn">View My Work</a>
    </section>

    <section id="projects" class="container">
        <h2 class="section-title">Selected Projects</h2>
        <div class="projects-grid">
            <!-- Project 1 -->
            <div class="project-card">
                <div class="card-image">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div class="card-content">
                    <h3>Neon Dashboard</h3>
                    <p>An interactive dashboard with real-time data visualization and dark mode aesthetics.</p>
                    <a href="#" class="card-link">View Project &rarr;</a>
                </div>
            </div>

            <!-- Project 2 -->
            <div class="project-card">
                <div class="card-image">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <div class="card-content">
                    <h3>Audio Visualizer</h3>
                    <p>A live music visualization tool using Web Audio API and canvas manipulation.</p>
                    <a href="#" class="card-link">View Project &rarr;</a>
                </div>
            </div>

            <!-- Project 3 -->
            <div class="project-card">
                <div class="card-image">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div class="card-content">
                    <h3>E-Commerce UI</h3>
                    <p>A fully responsive checkout page with cart functionality and Stripe integration.</p>
                    <a href="#" class="card-link">View Project &rarr;</a>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <h2 class="section-title">Get In Touch</h2>
        <form class="contact-form">
            <div class="form-group">
                <input type="text" placeholder="Your Name" required>
            </
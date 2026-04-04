<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vortex | Creative Coding Portfolio</title>
    <style>
        /* --- RESET & VARIABLES --- */
        :root {
            --bg-color: #09090b;
            --card-bg: #18181b;
            --text-main: #ffffff;
            --text-muted: #a1a1aa;
            --accent: #7c3aed;
            --accent-glow: rgba(124, 58, 237, 0.4);
            --font-main: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-main);
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
        }

        a { text-decoration: none; color: inherit; transition: 0.3s; }
        ul { list-style: none; }

        /* --- TYPOGRAPHY --- */
        h1, h2, h3 {
            line-height: 1.2;
            font-weight: 800;
        }

        h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #fff, #a1a1aa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: var(--text-muted);
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }

        /* --- LAYOUT UTILITIES --- */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .section-padding {
            padding: 8rem 0;
        }

        .text-center { text-align: center; }

        /* --- HEADER --- */
        header {
            padding: 2rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
            background: rgba(9, 9, 11, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -1px;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            font-size: 0.95rem;
            color: var(--text-muted);
        }

        .nav-links a:hover {
            color: var(--text-main);
        }

        /* --- HERO SECTION --- */
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
        }

        /* Animated Background Gradient */
        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at 15% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
            z-index: -1;
            filter: blur(40px);
        }

        .hero-content {
            max-width: 800px;
            z-index: 2;
        }

        .hero h1 {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            background: linear-gradient(to right, #fff, #a1a1aa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 1.5rem;
            color: var(--text-muted);
            margin-bottom: 2.5rem;
        }

        .btn {
            display: inline-block;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
            border: 1px solid var(--accent);
        }

        .btn-primary:hover {
            background: transparent;
            color: var(--accent);
            box-shadow: 0 0 20px var(--accent-glow);
        }

        /* --- ABOUT --- */
        .about {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .about-text h3 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .about-text p {
            margin-bottom: 1rem;
        }

        .stats {
            display: flex;
            gap: 2rem;
            margin-top: 3rem;
        }

        .stat-item h4 {
            font-size: 3rem;
            color: var(--accent);
            font-weight: 700;
        }

        .stat-item span {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* --- PROJECTS --- */
        .projects {
            background: #0f0f13;
        }

        .section-header {
            margin-bottom: 4rem;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .project-card {
            background: var(--card-bg);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .card-img {
            height: 200px;
            width: 100%;
            object-fit: cover;
            background: #333; /* Placeholder color */
        }

        .card-content {
            padding: 2rem;
        }

        .card-content h3 {
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }

        .card-content p {
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-bottom: 1.5rem;
        }

        .card-links {
            display: flex;
            gap: 1rem;
            font-size: 0.85rem;
            color: var(--text-muted);
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 1.5rem;
        }

        .card-links a:hover {
            color: var(--accent);
        }

        /* --- CONTACT --- */
        .contact {
            background: linear-gradient(to right, #09090b, #18181b);
        }

        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 2.5rem;
            border-radius: 16px;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            color: white;
            font-family: inherit;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent);
        }

        /* --- FOOTER --- */
        footer {
            padding: 4rem 0;
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.05);
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
            .hero h1 { font-size: 3rem; }
            .about { grid-template-columns: 1fr; }
            .nav-links { display: none; } /* Simplified for demo */
            .section-padding { padding: 4rem 0; }
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <a href="#" class="logo">Vortex.</a>
                <ul class="nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#projects">Work</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="about">
        <div class="container">
            <div class="hero-content">
                <h1>Building the Future.</h1>
                <p>I am a full-stack developer passionate about creating responsive, high-performance web applications.</p>
                <a href="#projects" class="btn btn-primary">View My Work</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="section-padding about" id="about">
        <div class="container">
            <div class="about-text">
                <h2>My Story</h2>
                <p>
                    I specialize in crafting clean, semantic, and accessible code. Whether it's building high-performance websites or building complex microservices, my goal is always to solve problems with elegant solutions.
                </p>
                <p>
                    I love contributing to open-source projects and staying updated on the latest trends in the web development ecosystem.
                </p>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <h4>15+</h4>
                    <span>Years Experience</span>
                </div>
                <div class="stat-item">
                    <h4>120+</h4>
                    <span>Projects Delivered</span>
                </div>
                <div class="stat-item">
                    <h4>50%</h4>
                    <span>Happy Clients</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section class="section-padding projects" id="projects">
        <div class="container">
            <div class="section-header text-center">
                <h2>Selected Works</h2>
                <p>A selection of recent projects I have worked on.</p>
            </div>

            <div class="project-grid">
                <!-- Project 1 -->
                <div class="project-card">
                    <!-- Using Unsplash Placeholder -->
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Project 1" class="card-img">
                    <div class="card-content">
                        <h3>FinTech Dashboard</h3>
                        <p>A comprehensive analytics dashboard for financial institutions featuring real-time data visualization and payment processing.</p>
                        <div class="card-links">
                            <a href="#">View Code</a>
                            <a href="#">GitHub</a>
                        </div>
                    </div>
                </div>

                <!-- Project
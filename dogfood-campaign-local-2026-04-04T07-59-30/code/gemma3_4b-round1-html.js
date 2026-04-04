<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coder Portfolio</title>
    <style>
        /* Global Styles */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Orbitron:wght@500&display=swap');

        :root {
            --primary-color: #6a11cb;
            --secondary-color: #2575fc;
            --background-dark: #0a0a1f;
            --text-light: #e0e0ff;
            --card-bg: #1a1a33;
            --accent-glow: rgba(106, 17, 203, 0.8);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--background-dark);
            color: var(--text-light);
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--secondary-color);
            transition: color 0.3s;
        }

        a:hover {
            color: var(--primary-color);
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }

        /* Utility Classes */
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 40px;
            font-weight: 700;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Header & Navigation */
        header {
            background: rgba(10, 10, 31, 0.95);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }

        .logo {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-light);
        }

        nav a {
            margin-left: 25px;
            font-weight: 400;
            color: var(--text-light);
        }

        nav a:hover {
            color: var(--primary-color);
        }

        /* Hero Section */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            background-size: 200% 200%;
            animation: gradientShift 15s ease infinite;
            padding: 0;
            position: relative;
            overflow: hidden;
        }

        #hero::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.2); /* Subtle overlay */
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            z-index: 10;
            padding: 20px;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 15px;
            font-weight: 700;
            animation: fadeInDown 1s ease-out;
        }

        .hero-content p {
            font-size: 1.5rem;
            margin-bottom: 30px;
            font-weight: 300;
            animation: fadeInUp 1s ease-out 0.2s both;
        }

        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: #fff;
            color: var(--primary-color);
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            animation: fadeInUp 1s ease-out 0.4s both;
        }

        .cta-button:hover {
            background: var(--primary-color);
            color: white;
            box-shadow: 0 8px 20px rgba(106, 17, 203, 0.5);
            transform: translateY(-2px);
        }

        /* Project Section */
        #projects {
            padding: 80px 0;
            background-color: #101025;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background-color: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-top: 3px solid transparent;
            cursor: pointer;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(106, 17, 203, 0.4);
            border-top-color: var(--secondary-color);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            filter: grayscale(10%);
            transition: filter 0.3s;
        }

        .project-card:hover img {
            filter: grayscale(0);
        }

        .card-content {
            padding: 20px;
        }

        .card-content h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: var(--secondary-color);
        }

        .card-content p {
            margin-bottom: 15px;
            font-size: 0.95rem;
            color: #aaa;
        }

        .card-links a {
            display: inline-block;
            margin-right: 15px;
            font-weight: 600;
            padding: 8px 12px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.05);
            transition: background 0.3s;
        }

        .card-links a:hover {
            background: var(--primary-color);
            color: white;
        }

        /* Contact Section */
        #contact {
            padding: 80px 0;
            background-color: #0e0e2a;
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .contact-form-container h2 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2rem;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #3a3a5a;
            border-radius: 8px;
            background-color: #151528;
            color: var(--text-light);
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--secondary-color);
            outline: none;
            box-shadow: 0 0 5px var(--secondary-color);
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        .submit-button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .submit-button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(106, 17, 203, 0.5);
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 25px 0;
            background-color: #050515;
            border-top: 1px solid rgba(50, 50, 80, 0.2);
        }

        footer p {
            margin: 0;
            font-size: 0.9rem;
            color: #888;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 3rem;
            }
            .hero-content p {
                font-size: 1.2rem;
            }
        }

        @media (max-width: 600px) {
            header .container {
                flex-direction: column;
                gap: 15px;
            }
            nav {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            nav a {
                margin: 5px 10px;
                display: block;
            }
            .hero-content h1 {
                font-size: 2.5rem;
            }
            .hero-content p {
                font-size: 1.1rem;
            }
            .section-title {
                font-size: 2rem;
            }
            .project-grid {
                gap: 20px;
            }
            .project-card {
                min-width: 100%;
            }
        }

        /* Keyframe Animations */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

    <header>
        <div class="container">
            <div class="logo">CODE<span style="color: var(--secondary-color);">X</span>.DEV</div>
            <nav>
                <a href="#hero">Home</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section with Animated Gradient Background -->
    <section id="hero">
        <div class="hero-content">
            <h1 class="animate-on-load">Hi, I'm Alex. I build digital experiences.</h1>
            <p class="animate-on-load">Crafting responsive, high-performance, and visually stunning web applications using creative coding principles.</p>
            <a href="#projects" class="cta-button animate-on-load">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="container">
        <h2 class="section-title">Featured Projects</h2>
        <div class="project-grid">
            <!-- Project Card 1 -->
            <div class="project-card">
                <img src="https://via.placeholder.com/500x300/3f007d/FFFFFF?text=Interactive+Art" alt="Interactive Art Project">
                <div class="card-content">
                    <h3>Generative Art Engine</h3>
                    <p>A real-time visualization tool using p5.js to create dynamic, abstract patterns.</p>
                    <div class="card-links">
                        <a href="#" target="_blank">Live Demo</a>
                        <a href="#" target="_blank">Code</a>
                    </div>
                </div>
            </div>

            <!-- Project Card 2 -->
            <div class="project-card">
                <img src="https://via.placeholder.com/500x300/1e40af/FFFFFF?text=Web+Dashboard" alt="Data Dashboard">
                <div class="card-content">
                    <h3>SaaS Analytics Dashboard</h3>
                    <p>A complex, responsive dashboard built with React and modern state management.</p>
                    <div class="card-links">
                        <a href="#" target="_blank">View Case Study</a>
                        <a href="#" target="_blank">Live Demo</a>
                    </div>
                </div>
            </div>

            <!-- Project Card 3 -->
            <div class="project-card">
                <img src="https://via.placeholder.com/500x300/9d3b5d/FFFFFF?text=Micro+Site" alt="Micro Site Design">
                <div class="card-content">
                    <h3>Immersive Portfolio Site</h3>
                    <p>A single-page narrative site focusing on smooth scrolling and parallax effects.</p>
                    <div class="card-links">
                        <a href="#" target="_blank">View Live</a>
                        <a href="#" target="_blank">Details</a>
                    </div>
                </div>
            </div>
            
            <!-- Project Card 4 (Added for responsiveness) -->
            <div class="project-card">
                <img src="https://via.placeholder.com/500x300/4c8c60/FFFFFF?text=Game+Prototype" alt="Game Prototype">
                <div class="card-content">
                    <h3>Browser Game Prototype</h3>
                    <p>A physics-based puzzle game built with vanilla JavaScript for optimal performance.</p>
                    <div class="card-links">
                        <a href="#" target="_blank">Play Now</a>
                        <a href="#" target="_blank">GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch
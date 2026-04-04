<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio | [Your Name]</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        /* Global Reset and Variables */
        :root {
            --primary-color: #6a11cb;
            --secondary-color: #2575fc;
            --text-dark: #1a1a1a;
            --text-light: #f0f0f0;
            --bg-light: #ffffff;
            --bg-dark: #0d0d1a;
            --card-bg: rgba(255, 255, 255, 0.05);
            --gradient-start: #6a11cb;
            --gradient-end: #2575fc;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            background-color: var(--bg-light);
            color: var(--text-dark);
            scroll-behavior: smooth;
        }

        /* Utility Classes */
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 40px;
            color: var(--text-dark);
        }

        /* --- HEADER & NAVBAR --- */
        header {
            background-color: var(--bg-dark);
            color: var(--text-light);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }

        .logo a {
            color: var(--text-light);
            font-size: 1.8rem;
            font-weight: 700;
            text-decoration: none;
        }

        .nav-links a {
            color: var(--text-light);
            text-decoration: none;
            margin-left: 25px;
            font-weight: 400;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--secondary-color);
        }

        /* --- HERO SECTION --- */
        #hero {
            background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
            background-size: 200% 200%;
            animation: gradientAnimation 15s ease infinite;
            color: var(--text-light);
            text-align: center;
            padding: 100px 0;
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            padding: 20px;
        }

        .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 15px;
            animation: fadeInDown 1s ease-out;
        }

        .hero-content p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            opacity: 0.9;
            animation: fadeInUp 1.2s ease-out;
        }

        .cta-button {
            display: inline-block;
            background-color: var(--text-light);
            color: var(--gradient-end);
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: background-color 0.3s, transform 0.3s;
            border: none;
            cursor: pointer;
            animation: fadeInUp 1.4s ease-out;
        }

        .cta-button:hover {
            background-color: #f0f0f0;
            transform: translateY(-3px);
        }

        /* --- PROJECTS SECTION --- */
        #projects {
            background-color: var(--bg-light);
            padding: 80px 0;
        }

        #projects .container {
            text-align: center;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }

        .card {
            background: #f9f9f9;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
            text-align: left;
            display: flex;
            flex-direction: column;
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 30px rgba(106, 17, 203, 0.2);
        }

        .card-img {
            height: 200px;
            width: 100%;
            object-fit: cover;
            background: #ccc; /* Placeholder background */
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 1.2rem;
        }

        .card-content {
            padding: 20px;
            flex-grow: 1;
        }

        .card-content h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .card-content p {
            margin-bottom: 15px;
            color: #555;
            flex-basis: 70%;
        }

        .card-links a {
            display: inline-block;
            margin-right: 15px;
            color: var(--secondary-color);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }

        .card-links a:hover {
            color: var(--primary-color);
        }

        /* --- CONTACT SECTION --- */
        #contact {
            background-color: var(--bg-dark);
            color: var(--text-light);
            padding: 80px 0;
        }

        #contact .container {
            max-width: 700px;
        }

        #contact h2 {
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: var(--text-light);
        }

        .contact-form {
            background: #1c1c30;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-light);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 5px;
            background-color: #2d2d4d;
            color: var(--text-light);
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--secondary-color);
        }

        .submit-button {
            width: 100%;
            background-color: var(--primary-color);
            color: var(--text-light);
            padding: 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: background-color 0.3s, transform 0.2s;
        }

        .submit-button:hover {
            background-color: #8d3bfa;
            transform: translateY(-2px);
        }

        /* --- FOOTER --- */
        footer {
            background-color: #111;
            color: #aaa;
            text-align: center;
            padding: 20px 0;
            font-size: 0.9rem;
        }
        
        .social-links a {
            color: #aaa;
            margin: 0 15px;
            font-size: 1.5rem;
            text-decoration: none;
            transition: color 0.2s;
        }
        .social-links a:hover {
            color: var(--secondary-color);
        }


        /* ===================================
           MEDIA QUERIES (Responsiveness)
           =================================== */

        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 3rem;
            }
            .hero-content p {
                font-size: 1.1rem;
            }
        }

        @media (max-width: 768px) {
            /* Navigation adjustments */
            header .container {
                flex-direction: column;
                padding: 15px 20px;
                gap: 15px;
            }
            .nav-links {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }
            .nav-links a {
                margin: 5px 10px;
                font-size: 0.9rem;
            }

            /* Section adjustments */
            .section-title {
                font-size: 2rem;
            }

            .project-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
             .hero-content h1 {
                font-size: 2.5rem;
            }
            .hero-content p {
                font-size: 1rem;
            }
        }

        /* ===================================
           KEYFRAME ANIMATIONS (For polish)
           =================================== */
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

    <!-- HEADER & NAVIGATION -->
    <header>
        <div class="container">
            <div class="logo"><a href="#hero">CodeCraft.</a></div>
            <nav class="nav-links">
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
                <a href="#about">About</a>
            </nav>
        </div>
    </header>

    <!-- HERO SECTION (Animated Gradient Background) -->
    <section id="hero">
        <div class="hero-content">
            <h1 class="animated">Hi, I'm Alex. A Creative Coder.</h1>
            <p class="animated">Crafting interactive digital experiences with code, art, and design.</p>
            <a href="#projects" class="cta-button animated">View My Work</a>
        </div>
    </section>

    <!-- PROJECTS SECTION -->
    <section id="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="project-grid">
                
                <!-- Project Card 1 -->
                <div class="card">
                    <div class="card-img">Visualizer Placeholder</div>
                    <div class="card-content">
                        <h3>Generative Art Engine</h3>
                        <p>A complex creative coding project using p5.js to generate dynamic, evolving visual patterns based on user input.</p>
                        <div class="card-links">
                            <a href="#" target="_blank">View Live</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>
                
                <!-- Project Card 2 -->
                <div class="card">
                    <div class="card-img">Web Interaction Placeholder</div>
                    <div class="card-content">
                        <h3>Interactive Web Game</h3>
                        <p>A responsive, browser-based game built with Three.js, focusing on physics and user engagement.</p>
                        <div class="card-links">
                            <a href="#" target="_blank">View Live</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>
                
                <!-- Project Card 3 -->
                <div class="card">
                    <div class="card-img">Sound Visualizer Placeholder</div>
                    <div class="card-content">
                        <h3>Audio Spectrum Analyzer</h3>
                        <p>A visual representation of incoming audio frequencies, perfect for music visualization and data art.</p>
                        <div class="card-links">
                            <a href="#" target="_blank">View Live</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <p style="text-align: center; margin-bottom: 40px; color: #ccc;">Have a project in mind? Let's build something incredible together.</p>
            
            <form class="contact-form" action="#" method="POST">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        /* GLOBAL RESET AND VARIABLES */
        :root {
            --primary: #6a11cb;
            --secondary: #2575fc;
            --dark: #121212;
            --light: #f0f0f0;
            --text-color: #333;
            --bg-gradient-start: #6a11cb;
            --bg-gradient-end: #2575fc;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--dark);
            color: var(--light);
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: inherit;
            transition: color 0.3s;
        }

        /* UTILITY CONTAINERS */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* HEADER AND NAVIGATION */
        header {
            background: rgba(18, 18, 18, 0.9);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 20px;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #fff;
        }

        .nav-links a {
            margin-left: 25px;
            font-weight: 500;
            color: var(--light);
            display: inline-block;
        }

        .nav-links a:hover {
            color: var(--secondary);
        }

        /* HERO SECTION */
        #hero {
            background: linear-gradient(90deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 100px 0;
            min-height: 80vh;
        }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            font-weight: 700;
            background: linear-gradient(45deg, #fff, #ccc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-content p {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: #fff;
            color: var(--primary);
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* SECTION STYLING */
        section {
            padding: 80px 0;
            text-align: center;
        }

        h2 {
            font-size: 2.5rem;
            margin-bottom: 40px;
            color: #fff;
            position: relative;
            display: inline-block;
        }

        h2::after {
            content: '';
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            display: block;
            margin: 10px auto;
            border-radius: 2px;
        }

        /* PROJECT CARDS */
        #projects {
            background-color: #1c1c1c;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 20px 0;
        }

        .project-card {
            background: #222;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            transition: transform 0.3s, box-shadow 0.3s;
            text-align: left;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(94, 17, 203, 0.3);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
            filter: brightness(80%);
        }

        .card-content {
            padding: 20px;
        }

        .card-content h3 {
            color: var(--secondary);
            margin-bottom: 10px;
        }

        .card-content p {
            margin-bottom: 15px;
            color: #ccc;
        }

        .card-content .tech-stack {
            font-size: 0.9rem;
            color: var(--primary);
            margin-bottom: 15px;
        }

        .card-content a {
            display: inline-block;
            padding: 8px 15px;
            background: var(--primary);
            color: white;
            border-radius: 5px;
            transition: background 0.3s;
        }

        .card-content a:hover {
            background: var(--secondary);
            color: white;
        }

        /* CONTACT FORM */
        #contact {
            background-color: #121212;
            padding-bottom: 100px;
        }

        #contact-form {
            max-width: 600px;
            margin: 0 auto;
            text-align: left;
            background: #1c1c1c;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #ccc;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 5px;
            background: #282828;
            color: var(--light);
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--secondary);
            outline: none;
            box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
        }

        .submit-button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
            transition: opacity 0.3s;
        }

        .submit-button:hover {
            opacity: 0.9;
        }

        /* FOOTER */
        footer {
            background-color: #0d0d0d;
            padding: 30px 0;
            border-top: 1px solid #222;
            text-align: center;
            font-size: 0.9rem;
        }

        .social-links a {
            margin: 0 15px;
            font-size: 1.5rem;
            color: #aaa;
        }

        .social-links a:hover {
            color: var(--secondary);
        }

        /* RESPONSIVENESS */
        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                padding: 1rem;
            }

            .nav-links {
                margin-top: 15px;
                text-align: center;
            }

            .nav-links a {
                margin: 0 10px;
                font-size: 0.9rem;
            }

            .hero-content h1 {
                font-size: 3rem;
            }

            .hero-content p {
                font-size: 1.2rem;
            }
        }

        @media (max-width: 480px) {
            .hero-content h1 {
                font-size: 2.5rem;
            }

            .hero-content p {
                font-size: 1rem;
            }
            
            .project-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <!-- HEADER / NAVIGATION -->
    <header>
        <div class="container navbar">
            <div class="logo">CODEPORT<span style="color: var(--secondary);">.DEV</span></div>
            <nav class="nav-links">
                <a href="#hero">Home</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <!-- HERO SECTION -->
    <section id="hero">
        <div class="hero-content container">
            <h1 class="animate-fade-in">Hi, I'm Alex — a Creative Code Developer.</h1>
            <p class="animate-fade-in">Crafting interactive digital experiences using JavaScript, p5.js, and generative art.</p>
            <a href="#projects" class="cta-button animate-fade-in">View My Work</a>
        </div>
    </section>

    <!-- PROJECTS SECTION -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                
                <!-- Project Card 1 -->
                <div class="project-card">
                    <img src="https://picsum.photos/id/1015/600/400" alt="Generative Art">
                    <div class="card-content">
                        <h3>Generative Landscape</h3>
                        <p>A real-time visualization of Perlin noise, demonstrating fluid dynamics in code.</p>
                        <div class="tech-stack">Tech: p5.js, JavaScript, HTML Canvas</div>
                        <a href="#" target="_blank">View Live</a>
                    </div>
                </div>
                
                <!-- Project Card 2 -->
                <div class="project-card">
                    <img src="https://picsum.photos/id/1080/600/400" alt="Interactive Web App">
                    <div class="card-content">
                        <h3>Interactive Particle System</h3>
                        <p>A particle simulation reacting to mouse movement, perfect for UI backgrounds.</p>
                        <div class="tech-stack">Tech: Three.js, React, WebGL</div>
                        <a href="#" target="_blank">View Live</a>
                    </div>
                </div>
                
                <!-- Project Card 3 -->
                <div class="project-card">
                    <img src="https://picsum.photos/id/200/600/400" alt="Data Visualization">
                    <div class="card-content">
                        <h3>Data Viz Dashboard</h3>
                        <p>Visualizing complex data sets (e.g., climate change) into engaging, navigable graphs.</p>
                        <div class="tech-stack">Tech: D3.js, Python, SVG</div>
                        <a href="#" target="_blank">View Live</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p style="margin-bottom: 40px; color: #ccc;">Interested in a collaboration or project? Send me a message!</p>
            
            <form id="contact-form" action="#" method="POST">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>

                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required>
                </div>
                
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="6" required></textarea>
                </div>
                
                <button type="submit" class="submit-button">Send Message</button>
            </form>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="container">
            <p>&copy; 2024 CodePort.dev | Built with Creativity and Code.</p>
            <div class="social-links">
                <a href="#" aria
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio | [Your Name]</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        /* GLOBAL STYLES & RESET */
        :root {
            --primary-color: #ff5722; /* Vibrant Orange/Red */
            --secondary-color: #2c3e50; /* Dark Blue/Gray */
            --text-color: #ecf0f1; /* Light Gray */
            --bg-dark: #121212;
            --card-bg: #1e1e1e;
            --radius: 12px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-color);
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--primary-color);
            transition: color 0.3s;
        }

        a:hover {
            color: #ff8a65; /* Lighter orange on hover */
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }

        /* UTILITY CLASSES */
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.3s, background-color 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn:hover {
            transform: translateY(-3px);
            background-color: #ff8a65;
            box-shadow: 0 8px 15px rgba(255, 87, 34, 0.3);
        }

        section {
            padding: 80px 0;
        }

        /* HEADER & NAVIGATION */
        header {
            background-color: rgba(18, 18, 18, 0.95);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-color);
        }

        .nav-links a {
            margin-left: 25px;
            color: var(--text-color);
            font-weight: 400;
            transition: color 0.2s;
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        /* HERO SECTION - ANIMATION */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            text-align: center;
            /* Gradient Background Setup */
            background: linear-gradient(-45deg, #121212, #2c3e50, #1e3c4d, #121212);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
        }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            margin: 0 auto;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 15px;
            font-weight: 700;
            /* Text shadow for pop */
            text-shadow: 0 4px 10px rgba(255, 87, 34, 0.2);
        }

        .hero-content p {
            font-size: 1.4rem;
            margin-bottom: 30px;
            color: #b0bec5;
        }

        /* PROJECTS SECTION */
        #projects h2 {
            text-align: center;
            margin-bottom: 50px;
            font-size: 2.5rem;
            color: var(--text-color);
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background-color: var(--card-bg);
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            padding-bottom: 20px;
            display: flex;
            flex-direction: column;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 25px rgba(255, 87, 34, 0.2);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background-color: #333;
            filter: brightness(0.8);
        }

        .card-content {
            padding: 0 20px;
            flex-grow: 1;
        }

        .card-content h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
            font-size: 1.5rem;
        }

        .card-content p {
            margin-bottom: 15px;
            color: #b0bec5;
        }

        .card-links a {
            margin-right: 15px;
            font-size: 0.9rem;
            color: var(--text-color);
        }
        
        .card-links a:hover {
            color: var(--primary-color);
        }

        /* CONTACT SECTION */
        #contact h2 {
            text-align: center;
            margin-bottom: 40px;
            font-size: 2.5rem;
        }

        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            background-color: var(--card-bg);
            padding: 40px;
            border-radius: var(--radius);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-color);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 8px;
            background-color: #222;
            color: var(--text-color);
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 5px rgba(255, 87, 34, 0.5);
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        /* FOOTER */
        footer {
            background-color: #0a0a0a;
            text-align: center;
            padding: 25px 0;
            border-top: 1px solid #222;
            font-size: 0.9rem;
            color: #999;
        }

        /* MEDIA QUERIES FOR RESPONSIVENESS */
        @media (max-width: 768px) {
            /* Navigation */
            nav {
                flex-direction: column;
                padding: 10px;
            }

            .logo {
                margin-bottom: 10px;
            }

            .nav-links {
                margin-top: 10px;
            }

            .nav-links a {
                margin: 0 10px;
                display: inline-block;
            }

            /* Hero */
            #hero {
                height: 60vh;
                text-align: center;
            }

            .hero-content h1 {
                font-size: 3rem;
            }

            .hero-content p {
                font-size: 1.2rem;
            }

            /* Sections */
            section {
                padding: 60px 0;
            }

            /* Projects */
            .project-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <header>
        <div class="container">
            <nav>
                <div class="logo">CodeCraft.dev</div>
                <div class="nav-links">
                    <a href="#hero">Home</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- HERO SECTION -->
    <section id="hero">
        <div class="hero-content">
            <h1>Building Digital Worlds with Code.</h1>
            <p>I'm a creative coder specializing in interactive experiences, generative art, and responsive web design.</p>
            <a href="#projects" class="btn">View My Work</a>
        </div>
    </section>

    <!-- PROJECTS SECTION -->
    <section id="projects" class="container">
        <h2>Featured Projects</h2>
        <div class="project-grid">
            
            <!-- Project Card 1 -->
            <div class="project-card">
                <img src="https://via.placeholder.com/600x400/2c3e50/ecf0f1?text=Interactive+Data+Viz" alt="Data Visualization Project">
                <div class="card-content">
                    <h3>Generative Data Visualization</h3>
                    <p>An interactive dashboard visualizing complex datasets using JavaScript and D3.js.</p>
                    <div class="card-links">
                        <a href="#" target="_blank">Live Demo</a>
                        <a href="#" target="_blank">GitHub</a>
                    </div>
                </div>
            </div>

            <!-- Project Card 2 -->
            <div class="project-card">
                <img src="https://via.placeholder.com/600x400/ff5722/ffffff?text=WebGL+Artwork" alt="WebGL Artwork">
                <div class="card-content">
                    <h3>WebGL Particle System</h3>
                    <p>High-performance real-time particle simulation built with Three.js and WebGL.</p>
                    <div class="card-links">
                        <a href="#" target="_blank">Live Demo</a>
                        <a href="#" target="_blank">GitHub</a>
                    </div>
                </div>
            </div>

            <!-- Project Card 3 -->
            <div class="project-card">
                <img src="https://via.placeholder.com/600x400/1e3c4d/ecf0f1?text=React+Portfolio" alt="React Portfolio">
                <div class="card-content">
                    <h3>Modern Portfolio Site</h3>
                    <p>A fully responsive single-page application built with React hooks for state management.</p>
                    <div class="card-links">
                        <a href="#" target="_blank">Live Demo</a>
                        <a href="#" target="_blank">GitHub</a>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact" class="container">
        <h2>Get In Touch</h2>
        <div class="contact-form">
            <form action="#" method="POST">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit" class="btn">Send Message</button>
            </form>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <p>&copy; 2024 CodeCraft Portfolio. All rights reserved. | Built with Creative Code.</p>
    </footer>

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio | [Your Name]</title>
    <style>
        /* --- Global Styles & Variables --- */
        :root {
            --primary-color: #ff6b81;
            --secondary-color: #00b894;
            --text-dark: #2c3e50;
            --text-light: #ecf0f1;
            --bg-dark: #1a1a2e;
            --card-bg: #2c3e50;
            --gradient-start: #1a1a2e;
            --gradient-end: #0f3460;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #1a1a2e;
            color: var(--text-light);
            scroll-behavior: smooth;
            line-height: 1.6;
        }

        a {
            text-decoration: none;
            color: var(--primary-color);
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }

        /* --- Utility Classes --- */
        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin-top: 20px;
            border-radius: 5px;
            text-transform: uppercase;
            font-weight: bold;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: var(--text-dark);
            box-shadow: 0 4px 15px rgba(255, 107, 129, 0.4);
        }

        .btn-primary:hover {
            background-color: #ff8a9a;
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: none;
            color: var(--text-light);
            border: 2px solid var(--primary-color);
        }

        .btn-secondary:hover {
            background-color: var(--primary-color);
            color: var(--text-dark);
        }

        /* --- Header & Navigation --- */
        header {
            background-color: var(--bg-dark);
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
            padding: 0;
        }

        .logo {
            font-size: 1.8em;
            font-weight: 900;
            color: var(--primary-color);
        }

        nav a {
            margin-left: 25px;
            font-weight: 500;
            color: var(--text-light);
            transition: color 0.3s;
        }

        nav a:hover {
            color: var(--secondary-color);
        }

        /* --- Hero Section --- */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* Animated Gradient Background */
            background: linear-gradient(-45deg, var(--gradient-start), var(--gradient-end), #1e3c72);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            padding: 0;
            min-height: 70vh;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            padding: 20px;
            animation: fadeIn 1.5s ease-out;
        }

        .hero-content h1 {
            font-size: 3.5em;
            margin-bottom: 15px;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: typewrite 3s steps(40, end) forwards;
            overflow: hidden;
            white-space: nowrap;
            border-right: 3px solid rgba(255, 255, 255, .2);
        }

        .hero-content p {
            font-size: 1.4em;
            margin-bottom: 30px;
            color: #ccc;
        }

        /* --- Sections Styling --- */
        section {
            padding: 80px 0;
            text-align: center;
        }

        h2 {
            font-size: 2.5em;
            margin-bottom: 40px;
            text-align: center;
            color: var(--primary-color);
            position: relative;
        }

        h2::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: var(--secondary-color);
            margin: 10px auto 0;
            border-radius: 2px;
        }

        /* --- Projects Grid --- */
        #projects {
            background-color: var(--bg-dark);
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding-top: 30px;
        }

        .card {
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            padding: 25px;
            text-align: left;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-left: 5px solid var(--secondary-color);
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
        }

        .card h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .card p {
            margin-bottom: 15px;
            color: #ccc;
        }

        .card a.btn {
            margin-top: 10px;
            padding: 8px 15px;
            font-size: 0.9em;
        }

        /* --- Contact Form --- */
        #contact {
            background-color: #131322;
            padding: 60px 0;
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: var(--primary-color);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #444;
            border-radius: 5px;
            background-color: #222;
            color: var(--text-light);
            font-size: 1em;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--secondary-color);
            box-shadow: 0 0 5px rgba(0, 184, 148, 0.5);
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        /* --- Footer --- */
        footer {
            background-color: #1a1a2e;
            color: #aaa;
            padding: 30px 0;
            text-align: center;
            border-top: 1px solid #2c3e50;
        }

        footer a {
            color: var(--primary-color);
            margin: 0 10px;
        }

        /* --- Keyframe Animations --- */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typewrite {
            from { width: 0; }
            to { width: 100%; }
        }

        /* --- Responsiveness --- */
        @media (max-width: 768px) {
            header .container {
                flex-direction: column;
                gap: 15px;
            }

            nav {
                padding: 10px 0;
            }

            nav a {
                margin: 0 10px;
                font-size: 0.9em;
            }

            #hero {
                height: auto;
                min-height: 60vh;
                text-align: center;
                padding: 80px 20px;
            }

            .hero-content h1 {
                font-size: 2.5em;
            }

            .hero-content p {
                font-size: 1.2em;
            }

            .project-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <!-- Header & Navigation -->
    <header>
        <div class="container">
            <div class="logo">//CODE.PORT</div>
            <nav>
                <a href="#hero">Home</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <!-- 1. Hero Section (Animated Background) -->
    <section id="hero">
        <div class="hero-content">
            <h1>Hello, I'm Jane Doe.</h1>
            <p>Crafting interactive experiences through creative code and digital art.</p>
            <a href="#projects" class="btn btn-primary">View My Work</a>
        </div>
    </section>

    <!-- 2. Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Featured Creative Projects</h2>
            <div class="project-grid">

                <!-- Project Card 1 -->
                <div class="card">
                    <h3>Generative Art Engine</h3>
                    <p>A complex system using p5.js to generate evolving, abstract visual patterns based on user input and mathematical functions.</p>
                    <a href="#" class="btn btn-secondary">Live Demo</a>
                </div>

                <!-- Project Card 2 -->
                <div class="card">
                    <h3>Interactive Data Visualization</h3>
                    <p>An exploration of real-time climate data mapped onto a responsive, dynamic network graph built with Three.js.</p>
                    <a href="#" class="btn btn-secondary">View Code</a>
                </div>

                <!-- Project Card 3 -->
                <div class="card">
                    <h3>WebGL Shader Playground</h3>
                    <p>A minimalist interface allowing users to experiment with custom GLSL shaders for unique visual effects and distortions.</p>
                    <a href="#" class="btn btn-secondary">Explore</a>
                </div>

                <!-- Project Card 4 -->
                <div class="card">
                    <h3>Algorithmic Music Visualizer</h3>
                    <p>Synchronizing visual output with generated audio waveforms, creating a unique blend of sound and light.</p>
                    <a href="#" class="btn btn-secondary">Listen Now</a>
                </div>

            </div>
        </div>
    </section>

    <!-- 3. Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p style="margin-bottom: 40px; color: #ccc;">Have a project idea or collaboration in mind? Send me a message!</p>
            
            <div class="contact-form-container">
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
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 Jane Doe. All rights reserved.</p>
            <div style="margin-top: 10px;">
                <a href="mailto:youremail@example.com">Email</a> | 
                <a href="#">LinkedIn</a> | 
                <a href="#">GitHub</a>
            </div>
        </div>
    </footer>

</body>
</html>
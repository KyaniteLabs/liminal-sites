<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio - [Your Name]</title>
    <style>
        /* Global Reset and Variables */
        :root {
            --primary-color: #3498db;
            --secondary-color: #e74c3c;
            --text-dark: #2c3e50;
            --text-light: #ecf0f1;
            --bg-dark: #1c2833;
            --card-bg: rgba(255, 255, 255, 0.08);
            --gradient-start: #4facfe;
            --gradient-end: #00f3ff;
            --gradient-speed: 15s;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-light);
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--text-light);
            transition: color 0.3s;
        }

        a:hover {
            color: var(--primary-color);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Utility Classes */
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 40px;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* ========================== */
        /* NAVIGATION BAR */
        /* ========================== */
        header {
            background: rgba(28, 40, 51, 0.95);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .nav-links a {
            margin-left: 25px;
            font-weight: 500;
            padding: 5px 0;
            border-bottom: 2px solid transparent;
        }

        .nav-links a:hover {
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
        }

        /* ========================== */
        /* HERO SECTION */
        /* ========================== */
        #hero {
            height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end), var(--gradient-start));
            background-size: 300% 300%;
            animation: gradient-animation 15s ease infinite;
        }

        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            padding: 40px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            backdrop-filter: blur(5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 10px;
            color: #fff;
            animation: fadeInDown 1s ease-out;
        }

        .hero-content p {
            font-size: 1.5rem;
            margin-bottom: 30px;
            color: #ccc;
            animation: fadeInUp 1.2s ease-out;
        }

        .btn-primary {
            display: inline-block;
            padding: 12px 30px;
            background-color: var(--primary-color);
            color: #fff;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
            animation: fadeInUp 1.4s ease-out;
        }

        .btn-primary:hover {
            background-color: #2980b9;
            transform: translateY(-3px);
        }

        /* ========================== */
        /* PROJECTS SECTION */
        /* ========================== */
        #projects {
            padding: 80px 0;
            background-color: var(--bg-dark);
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background: var(--card-bg);
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            border-left: 4px solid var(--primary-color);
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
        }

        .project-card h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .project-card p {
            margin-bottom: 15px;
            color: #aaa;
        }

        .project-card .tags a {
            display: inline-block;
            background: rgba(52, 152, 219, 0.1);
            padding: 5px 10px;
            margin-right: 8px;
            margin-top: 5px;
            border-radius: 5px;
            font-size: 0.85rem;
        }

        /* ========================== */
        /* CONTACT SECTION */
        /* ========================== */
        #contact {
            padding: 80px 0;
            background-color: #131c24;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: var(--text-light);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #34495e;
            border-radius: 5px;
            background-color: #2c3e50;
            color: var(--text-light);
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        .btn-submit {
            width: 100%;
            padding: 12px;
            background-color: var(--secondary-color);
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
        }

        .btn-submit:hover {
            background-color: #c0392b;
            transform: translateY(-2px);
        }

        /* ========================== */
        /* FOOTER */
        /* ========================== */
        footer {
            text-align: center;
            padding: 20px 0;
            background: #111822;
            border-top: 1px solid #333;
            font-size: 0.9rem;
        }

        .social-links a {
            margin: 0 15px;
            font-size: 1.5rem;
        }


        /* ========================== */
        /* ANIMATIONS (Keyframes) */
        /* ========================== */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ========================== */
        /* RESPONSIVENESS */
        /* ========================== */
        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                text-align: center;
            }

            .nav-links {
                margin-top: 15px;
            }

            .nav-links a {
                margin: 0 10px;
                display: inline-block;
            }

            .hero-content h1 {
                font-size: 3rem;
            }

            .hero-content p {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>

    <!-- Navigation -->
    <header>
        <div class="container navbar">
            <div class="logo">CodeCraft.dev</div>
            <nav class="nav-links">
                <a href="#hero">Home</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="hero-content">
            <h1 class="animated">Hi, I'm Alex Thompson.</h1>
            <p class="animated">A creative coder turning complex ideas into interactive digital experiences.</p>
            <a href="#projects" class="btn-primary animated">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>

            <div class="project-grid">
                
                <!-- Project Card 1 -->
                <div class="project-card">
                    <h3>Generative Art Engine</h3>
                    <p>An interactive p5.js sketch that generates beautiful, evolving abstract patterns based on user input.</p>
                    <div class="tags">
                        <a href="#github">p5.js</a>
                        <a href="#javascript">JavaScript</a>
                        <a href="#creative">Generative</a>
                    </div>
                    <p style="margin-top: 15px;"><a href="#" style="color: var(--primary-color);">View Demo &rarr;</a></p>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <h3>Web Audio Visualizer</h3>
                    <p>A real-time audio frequency visualization built using Web Audio API, reacting dynamically to input music.</p>
                    <div class="tags">
                        <a href="#web-audio">Web Audio API</a>
                        <a href="#react">React</a>
                        <a href="#frontend">Frontend</a>
                    </div>
                    <p style="margin-top: 15px;"><a href="#" style="color: var(--primary-color);">Live Stream &rarr;</a></p>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <h3>Data Mapping Explorer</h3>
                    <p>A sophisticated visualization tool that maps complex, multi-dimensional datasets onto an intuitive 3D canvas.</p>
                    <div class="tags">
                        <a href="#d3">D3.js</a>
                        <a href="#three-js">Three.js</a>
                        <a href="#data">DataViz</a>
                    </div>
                    <p style="margin-top: 15px;"><a href="#" style="color: var(--primary-color);">Explore Data &rarr;</a></p>
                </div>

            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            
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
                    <button type="submit" class="btn-submit">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="social-links">
            <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        </div>
        <p>&copy; 2024 Alex Thompson. Creative Coding Portfolio.</p>
    </footer>

    <script>
        // Simple JS for smooth scrolling and potential interactivity
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* --- Global Styles --- */
        :root {
            --primary-color: #ff6b6b;
            --secondary-color: #4ecdc4;
            --text-dark: #2c3e50;
            --text-light: #ecf0f1;
            --bg-light: #f8f9fa;
            --bg-dark: #1a1a2e;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
            background-color: var(--bg-light);
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: auto;
            padding: 20px 0;
        }

        a {
            text-decoration: none;
            color: var(--primary-color);
            transition: color 0.3s;
        }

        a:hover {
            color: var(--secondary-color);
        }

        /* --- Header/Navigation --- */
        header {
            background: var(--bg-dark);
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
        }

        .logo {
            font-size: 1.8em;
            font-weight: bold;
            color: var(--text-light);
        }

        nav button {
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 1em;
            cursor: pointer;
            margin-left: 20px;
            padding: 8px 15px;
            transition: background-color 0.3s, color 0.3s;
        }

        nav button:hover {
            background-color: var(--primary-color);
            color: var(--bg-dark);
        }

        /* --- Hero Section --- */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* Animated Gradient Background */
            background: linear-gradient(135deg, var(--bg-dark) 0%, var(--primary-color) 50%, var(--secondary-color) 100%);
            background-size: 400% 400%;
            animation: gradientBackground 15s ease infinite;
        }

        @keyframes gradientBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
        }

        .hero-content h1 {
            font-size: 3.5em;
            margin-bottom: 15px;
            color: var(--text-light);
            animation: fadeInDown 1s ease-out;
        }

        .hero-content p {
            font-size: 1.5em;
            margin-bottom: 30px;
            color: rgba(255, 255, 255, 0.9);
            animation: fadeInUp 1.2s ease-out;
        }

        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: var(--secondary-color);
            color: var(--bg-dark);
            border-radius: 50px;
            font-weight: bold;
            text-transform: uppercase;
            transition: transform 0.3s, box-shadow 0.3s;
            animation: fadeInUp 1.4s ease-out;
        }

        .cta-button:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            color: var(--bg-dark);
        }

        /* --- Sections Styling --- */
        section {
            padding: 80px 0;
            text-align: center;
        }

        #projects {
            background-color: var(--bg-light);
        }

        h2 {
            font-size: 2.5em;
            margin-bottom: 40px;
            color: var(--text-dark);
            position: relative;
            display: inline-block;
        }

        h2::after {
            content: '';
            width: 60px;
            height: 4px;
            background-color: var(--primary-color);
            display: block;
            margin: 10px auto 0;
        }

        /* Project Grid */
        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }

        .project-card {
            background: var(--text-light);
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: left;
            transition: transform 0.3s, box-shadow 0.3s;
            border-top: 4px solid var(--secondary-color);
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .project-card h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .project-card p {
            margin-bottom: 15px;
            color: #555;
        }

        .project-card .tags span {
            display: inline-block;
            background: #eee;
            padding: 5px 10px;
            margin-right: 5px;
            border-radius: 5px;
            font-size: 0.8em;
            color: #777;
        }

        /* Contact Form */
        #contact {
            background-color: var(--bg-dark);
            color: var(--text-light);
        }

        #contact h2 {
            color: var(--text-light);
        }
        #contact h2::after {
            background-color: var(--secondary-color);
        }

        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background: #2c3e50;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            text-align: left;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: var(--secondary-color);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 5px;
            background-color: #3a4e63;
            color: var(--text-light);
            font-size: 1em;
            transition: background-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            background-color: #40556b;
        }

        .submit-button {
            width: 100%;
            padding: 12px;
            background-color: var(--primary-color);
            color: var(--bg-dark);
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: bold;
            transition: background-color 0.3s;
        }

        .submit-button:hover {
            background-color: #e74c3c;
        }

        /* --- Footer --- */
        footer {
            background-color: #111;
            color: #aaa;
            padding: 20px 0;
            text-align: center;
            font-size: 0.9em;
        }

        footer a {
            color: var(--secondary-color);
            margin: 0 10px;
        }

        /* --- Animations --- */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* --- Responsiveness --- */
        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 2.8em;
            }
            .hero-content p {
                font-size: 1.2em;
            }
            .project-card {
                padding: 15px;
            }
        }

        @media (max-width: 600px) {
            header .container {
                flex-direction: column;
                padding: 10px 0;
            }
            .logo {
                margin-bottom: 10px;
            }
            nav button {
                margin: 5px 5px;
                display: inline-block;
            }
            h2 {
                font-size: 2em;
            }
            section {
                padding: 50px 0;
            }
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="container">
            <div class="logo">CodeCanvas.dev</div>
            <nav>
                <a href="#projects" style="margin-right: 20px; color: var(--text-light); font-weight: 500;">Projects</a>
                <a href="#contact" style="margin-right: 20px; color: var(--text-light); font-weight: 500;">Contact</a>
                <button>Resume</button>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="hero-content">
            <h1>Hi, I'm Alex.</h1>
            <p>Creative Coder crafting interactive digital experiences with HTML, CSS, and JavaScript.</p>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                <!-- Project Card 1 -->
                <div class="project-card">
                    <h3>Generative Art Engine</h3>
                    <p>An interactive visualization using p5.js that generates unique, evolving patterns based on user input.</p>
                    <div class="tags">
                        <span>p5.js</span>
                        <span>JavaScript</span>
                        <span>Math</span>
                    </div>
                    <p style="margin-top: 15px;"><a href="#" style="display: block; text-align: center;">View Project &rarr;</a></p>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <h3>CSS Grid Layout Showcase</h3>
                    <p>A responsive layout demonstration showcasing advanced CSS Grid and Flexbox capabilities for modern web design.</p>
                    <div class="tags">
                        <span>CSS</span>
                        <span>HTML5</span>
                        <span>Responsiveness</span>
                    </div>
                    <p style="margin-top: 15px;"><a href="#" style="display: block; text-align: center;">View Project &rarr;</a></p>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <h3>Particle Simulation Web App</h3>
                    <p>Real-time particle system simulating fluid dynamics and mouse interaction in the browser.</p>
                    <div class="tags">
                        <span>WebGL</span>
                        <span>Three.js</span>
                        <span>JavaScript</span>
                    </div>
                    <p style="margin-top: 15px;"><a href="#" style="display: block; text-align: center;">View Project &rarr;</a></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p style="margin-bottom: 30px;">Have a unique idea or collaboration in mind? Let's build something amazing together.</p>
            
            <div class="contact-form">
                <form id="contactForm">
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
                        <textarea id="message" name="message" rows="6" required></textarea>
                    </div>
                    <button type="submit" class="submit-button">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 CodeCanvas Portfolio. Crafted with <span style="color: var(--primary-color);">Code</span> & <span style="color: var(--secondary-color);">Design</span>.</p>
            <p style="margin-top: 10px;">
                <a href="mailto:you@example.com">Email</a> | 
                <a href="#" aria-label="LinkedIn Profile">LinkedIn</a> | 
                <a href="#" aria-label="GitHub Profile">GitHub</a>
            </p>
        </div>
    </footer>

    <script>
        // Simple form handling script (prevents default submission for demo)
        document.getElementById('contactForm').addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Thank you for your message! I will get back to you shortly.');
            this.reset();
        });
    </script>
</body>
</html>
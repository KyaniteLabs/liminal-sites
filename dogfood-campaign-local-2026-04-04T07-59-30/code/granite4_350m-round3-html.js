<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio | [Your Name]</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        /* 
        * CSS STYLES
        * Using CSS variables for easy color changes
        * For a single file output, all CSS is embedded.
        */

        :root {
            --primary-color: #ff6b81; /* Example Accent */
            --secondary-color: #4d50e7; /* Example Secondary */
            --text-dark: #1f2937;
            --text-light: #f3f4f6;
            --bg-dark: #0a0a1a;
            --card-bg: rgba(255, 255, 255, 0.08);
            --card-hover: rgba(255, 255, 255, 0.15);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-light);
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--primary-color);
        }

        /* Utility Classes */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .btn {
            display: inline-block;
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.3s, background-color 0.3s;
            border: none;
            cursor: pointer;
            text-align: center;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: var(--text-dark);
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(255, 107, 129, 0.4);
        }

        /* HEADER/NAV */
        header {
            background: var(--bg-dark);
            padding: 20px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-light);
        }

        nav a {
            margin-left: 25px;
            color: var(--text-light);
            font-weight: 400;
            transition: color 0.3s;
        }

        nav a:hover {
            color: var(--primary-color);
        }

        /* HERO SECTION */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* Animated Gradient Background Setup */
            background: linear-gradient(135deg, #0a0a1a, #1a0a2a, #0a0a1a, #1a0a2a);
            background-size: 400% 400%;
            animation: gradient-shift 15s ease infinite;
        }

        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            font-weight: 700;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: var(--text-light);
            background-image: linear-gradient(to right, var(--primary-color), var(--secondary-color));
        }

        .hero-content p {
            font-size: 1.3rem;
            margin-bottom: 40px;
            color: #ccc;
        }

        /* PROJECTS SECTION */
        #projects {
            padding: 80px 0;
            background-color: #0a0a1a;
            text-align: center;
        }

        #projects h2 {
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: var(--text-light);
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background: var(--card-bg);
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            text-align: left;
            border-left: 4px solid var(--primary-color);
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
        }

        .project-card h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
            font-size: 1.5rem;
        }

        .project-card p {
            margin-bottom: 15px;
        }

        .project-card .tech-stack span {
            display: inline-block;
            background: var(--secondary-color);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        /* CONTACT SECTION */
        #contact {
            padding: 80px 0;
            background-color: #1a0a2a;
            text-align: center;
        }

        #contact h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
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
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.05);
            color: var(--text-light);
            font-family: inherit;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 5px rgba(255, 107, 129, 0.5);
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        /* FOOTER */
        footer {
            background: #0a0a1a;
            color: #aaa;
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #222;
        }

        footer p {
            margin: 0;
            font-size: 0.9rem;
        }

        /* RESPONSIVENESS */
        @media (max-width: 768px) {
            .hero-content h1 {
                font-size: 3rem;
            }
            .hero-content p {
                font-size: 1.1rem;
            }
            header .container {
                flex-direction: column;
                text-align: center;
            }
            nav {
                margin-top: 15px;
            }
            nav a {
                margin: 0 10px;
                display: inline-block;
            }
            .project-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <!-- HEADER/NAVIGATION -->
    <header>
        <div class="container">
            <div class="logo">CodeCraft.dev</div>
            <nav>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
                <a href="#about">About</a>
            </nav>
        </div>
    </header>

    <!-- HERO SECTION -->
    <section id="hero">
        <div class="hero-content">
            <h1 class="animate-fade-in">Building Digital Experiences through Code</h1>
            <p class="animate-fade-in" style="animation-delay: 0.2s;">
                Creative coder specializing in generative art, interactive web interfaces, and full-stack solutions.
            </p>
            <a href="#projects" class="btn btn-primary animate-fade-in" style="animation-delay: 0.4s;">View My Work</a>
        </div>
    </section>

    <!-- PROJECTS SECTION -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                
                <!-- Project Card 1 -->
                <div class="project-card">
                    <h3>Generative Art Platform</h3>
                    <p>Interactive canvas using p5.js to create dynamic, procedural visual art based on user input and real-time data feeds.</p>
                    <div class="tech-stack">
                        <span>p5.js</span>
                        <span>JavaScript</span>
                        <span>HTML</span>
                    </div>
                    <div style="margin-top: 15px;"><a href="#" style="color: var(--primary-color);">View Project &rarr;</a></div>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <h3>Algorithmic Music Visualizer</h3>
                    <p>A real-time audio visualizer that interprets sound frequencies and maps them to complex geometric patterns and color shifts.</p>
                    <div class="tech-stack">
                        <span>Web Audio API</span>
                        <span>React</span>
                        <span>CSS</span>
                    </div>
                    <div style="margin-top: 15px;"><a href="#" style="color: var(--primary-color);">View Project &rarr;</a></div>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <h3>E-commerce Headless CMS</h3>
                    <p>A full-stack e-commerce solution built with Next.js and Stripe, demonstrating robust backend architecture and scalable design.</p>
                    <div class="tech-stack">
                        <span>Next.js</span>
                        <span>MongoDB</span>
                        <span>Stripe</span>
                    </div>
                    <div style="margin-top: 15px;"><a href="#" style="color: var(--primary-color);">View Project &rarr;</a></div>
                </div>

                <!-- Project Card 4 (Example for diversity) -->
                <div class="project-card">
                    <h3>Data Visualization Dashboard</h3>
                    <p>An interactive dashboard visualizing complex global climate data using D3.js, allowing users to filter and explore trends.</p>
                    <div class="tech-stack">
                        <span>D3.js</span>
                        <span>Python</span>
                        <span>JavaScript</span>
                    </div>
                    <div style="margin-top: 15px;"><a href="#" style="color: var(--primary-color);">View Project &rarr;</a></div>
                </div>

            </div>
        </div>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact">
        <div class="container">
            <h2>Ready to Build Something Amazing?</h2>
            <p style="margin-bottom: 40px; color: #ccc;">Have a creative idea or a technical challenge? Let's connect and bring it to life.</p>
            
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
                        <label for="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="container">
            <p>&copy; 2024 CodeCraft Portfolio. Designed and Developed by [Your Name].</p>
            <p style="margin-top: 5px; font-size: 0.9rem;">Built with Passion and Code.</p>
        </div>
    </footer>

    <!-- JAVASCRIPT (Optional: For small interactivity) -->
    <script>
        // Simple JS for smooth scrolling effects (optional, as CSS already handles basic scroll behavior)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
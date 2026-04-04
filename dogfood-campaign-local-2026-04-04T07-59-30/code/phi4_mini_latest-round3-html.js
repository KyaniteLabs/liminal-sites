<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* Global Styles */
        :root {
            --primary-color: #3a1c71;
            --secondary-color: #a333ff;
            --text-dark: #1a1a1a;
            --text-light: #f4f4f9;
            --bg-gradient-start: #6a11cb;
            --bg-gradient-end: #2575fc;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #0a0a1a;
            color: var(--text-light);
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--secondary-color);
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: auto;
            padding: 40px 0;
        }

        /* Header & Navigation */
        header {
            background: rgba(10, 10, 26, 0.9);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 5%;
        }

        .logo h1 {
            font-size: 1.8em;
            color: var(--secondary-color);
        }

        nav ul {
            list-style: none;
            display: flex;
        }

        nav ul li {
            margin-left: 30px;
        }

        nav ul li a {
            color: var(--text-light);
            font-weight: 500;
            transition: color 0.3s ease;
            padding: 5px 0;
        }

        nav ul li a:hover {
            color: var(--secondary-color);
        }

        /* Hero Section */
        #hero {
            background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
            height: 80vh;
            display: flex;
            align-items: center;
            text-align: center;
            /* Animation for gradient background - handled by CSS keyframes or JS for advanced effects */
            background-size: 200% 200%;
            animation: gradientBackground 15s ease infinite;
        }

        @keyframes gradientBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .hero-content h2 {
            font-size: 3.5em;
            margin-bottom: 20px;
            color: #fff;
            text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-content p {
            font-size: 1.3em;
            margin-bottom: 40px;
            opacity: 0.9;
        }

        .cta-button {
            display: inline-block;
            background-color: var(--secondary-color);
            color: white;
            padding: 12px 35px;
            border-radius: 30px;
            font-size: 1.1em;
            transition: background-color 0.3s ease, transform 0.2s;
            border: none;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(163, 51, 255, 0.4);
        }

        .cta-button:hover {
            background-color: #9029d8;
            transform: translateY(-2px);
        }

        /* Sections Styling */
        section {
            padding: 80px 0;
        }

        #projects {
            background-color: #101025;
            text-align: center;
        }

        h3 {
            font-size: 2.5em;
            margin-bottom: 50px;
            color: var(--secondary-color);
            position: relative;
            display: inline-block;
        }

        h3::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: var(--secondary-color);
            margin: 10px auto;
            border-radius: 2px;
        }

        /* Project Cards */
        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 0 20px;
        }

        .project-card {
            background: #1e1e30;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #2c2c4a;
        }

        .project-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 15px 30px rgba(163, 51, 255, 0.3);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background-color: #333; /* Placeholder color */
        }

        .card-content {
            padding: 20px;
            text-align: left;
        }

        .card-content h4 {
            color: var(--secondary-color);
            margin-bottom: 10px;
            font-size: 1.4em;
        }

        .card-content p {
            margin-bottom: 15px;
            color: #ccc;
        }

        .project-card .tags span {
            display: inline-block;
            background: var(--primary-color);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8em;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        /* Contact Form */
        #contact {
            background-color: #0a0a1a;
            text-align: center;
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            background: #151525;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            text-align: left;
        }

        .contact-form-container h3 {
            text-align: center;
            margin-bottom: 30px;
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
            border: 1px solid #3a3a5a;
            border-radius: 8px;
            background: #1e1e30;
            color: var(--text-light);
            font-size: 1em;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--secondary-color);
            outline: none;
            box-shadow: 0 0 5px rgba(163, 51, 255, 0.5);
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        .submit-button {
            display: block;
            width: 100%;
            padding: 15px;
            background-color: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .submit-button:hover {
            background-color: #9029d8;
        }

        /* Footer */
        footer {
            background-color: #050510;
            color: #aaa;
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #1a1a3a;
        }

        footer p {
            margin: 0;
        }

        /* Responsiveness */
        @media (max-width: 900px) {
            header .container {
                flex-direction: column;
                text-align: center;
            }
            nav ul {
                padding-top: 15px;
                flex-direction: column;
                gap: 15px;
            }
            nav ul li {
                margin: 0;
            }
            .hero-content h2 {
                font-size: 2.8em;
            }
            .hero-content p {
                font-size: 1.1em;
            }
        }

        @media (max-width: 600px) {
            .container {
                padding: 20px 0;
            }
            h3 {
                font-size: 2em;
                margin-bottom: 30px;
            }
            .hero-content h2 {
                font-size: 2.5em;
            }
            .project-grid {
                gap: 20px;
            }
        }
    </style>
</head>
<body>

    <!-- Header & Navigation -->
    <header>
        <div class="container">
            <div class="logo">
                <h1>CodeCraft.dev</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="#hero">Home</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="container hero-content">
            <h2>Building Experiences with Code & Creativity</h2>
            <p>I craft interactive, visually stunning digital art and functional web applications using creative coding principles.</p>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h3>Featured Projects</h3>
            <div class="project-grid">
                <!-- Project Card 1 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x300?text=Generative+Art" alt="Generative Art">
                    <div class="card-content">
                        <h4>Cosmic Flow Generator</h4>
                        <p>A real-time simulation using p5.js to visualize complex particle movements.</p>
                        <div class="tags">
                            <span>p5.js</span>
                            <span>JavaScript</span>
                            <span>Visualization</span>
                        </div>
                        <div style="margin-top: 15px;"><a href="#" style="color: var(--secondary-color); font-weight: bold;">View Live &rarr;</a></div>
                    </div>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x300?text=Interactive+Web+UI" alt="Interactive UI">
                    <div class="card-content">
                        <h4>Adaptive Portfolio UI</h4>
                        <p>A responsive layout featuring complex state management for modern web apps.</p>
                        <div class="tags">
                            <span>React</span>
                            <span>CSS Grid</span>
                            <span>UX/UI</span>
                        </div>
                        <div style="margin-top: 15px;"><a href="#" style="color: var(--secondary-color); font-weight: bold;">View Live &rarr;</a></div>
                    </div>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x300?text=WebGL+Visualization" alt="WebGL Visualization">
                    <div class="card-content">
                        <h4>WebGL Landscape</h4>
                        <p>High-performance 3D rendering built with Three.js for immersive web experiences.</p>
                        <div class="tags">
                            <span>Three.js</span>
                            <span>WebGL</span>
                            <span>3D Graphics</span>
                        </div>
                        <div style="margin-top: 15px;"><a href="#" style="color: var(--secondary-color); font-weight: bold;">View Live &rarr;</a></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h3>Get In Touch</h3>
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
                    <button type="submit" class="submit-button">Send Inquiry</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 CodeCraft Portfolio. Crafted with creativity and code.</p>
        </div>
    </footer>

    <script>
        // Simple JavaScript for smooth scrolling on nav links (optional, but good practice)
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
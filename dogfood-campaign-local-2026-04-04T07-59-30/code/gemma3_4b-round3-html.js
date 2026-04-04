<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio</title>
    <style>
        /* Global Styles & Reset */
        :root {
            --primary-color: #3a7bd5;
            --secondary-color: #3a3a5e;
            --text-dark: #1c1c2e;
            --text-light: #f0f0f5;
            --bg-dark: #0a0a1a;
            --accent-gradient-start: #ff00cc;
            --accent-gradient-end: #3333ff;
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
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 0;
        }

        /* Utility Classes */
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(45deg, var(--accent-gradient-start), var(--accent-gradient-end));
            border: none;
            border-radius: 30px;
            color: var(--text-light);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(58, 123, 213, 0.3);
            opacity: 0.9;
        }

        /* Header & Navigation */
        header {
            background-color: rgba(10, 10, 26, 0.95);
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
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 800;
            background: linear-gradient(45deg, var(--accent-gradient-start), var(--accent-gradient-end));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        nav a {
            margin-left: 25px;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.95rem;
        }

        /* Hero Section */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
            position: relative;
            /* Animated Gradient Background */
            background: linear-gradient(-45deg, var(--bg-dark), var(--secondary-color), #1a0e30);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 700px;
            padding: 40px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 15px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 15px;
            line-height: 1.1;
            background: linear-gradient(45deg, var(--text-light), var(--primary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-content p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            color: #ccc;
        }

        /* Section Styling */
        section {
            padding: 80px 0;
        }

        h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: var(--primary-color);
            position: relative;
        }

        h2::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, var(--accent-gradient-start), var(--accent-gradient-end));
            margin: 10px auto 0;
            border-radius: 2px;
        }

        /* Projects Section */
        #projects {
            background-color: #050510;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background-color: var(--secondary-color);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(58, 123, 213, 0.4);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }

        .project-info {
            padding: 20px;
        }

        .project-info h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .project-info p {
            margin-bottom: 15px;
            color: #aaa;
        }

        /* Contact Form Section */
        #contact {
            background-color: var(--bg-dark);
            text-align: center;
        }

        .contact-form-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background: #121225;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid var(--primary-color);
        }

        .contact-form-wrapper label {
            display: block;
            margin-bottom: 8px;
            text-align: left;
            font-weight: 500;
            color: #ccc;
        }

        .contact-form-wrapper input[type="text"],
        .contact-form-wrapper input[type="email"],
        .contact-form-wrapper textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: #1e1e30;
            color: var(--text-light);
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .contact-form-wrapper input:focus,
        .contact-form-wrapper textarea:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 5px rgba(58, 123, 213, 0.5);
        }

        .contact-form-wrapper textarea {
            resize: vertical;
            min-height: 150px;
        }

        /* Footer */
        footer {
            background-color: #000011;
            text-align: center;
            padding: 25px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 0.9rem;
        }

        footer a {
            margin: 0 15px;
        }

        /* Responsiveness */
        @media (max-width: 992px) {
            .hero-content h1 {
                font-size: 2.8rem;
            }
            .hero-content p {
                font-size: 1.1rem;
            }
            nav {
                display: none; /* Simple mobile nav handling */
            }
            header .container {
                justify-content: center;
            }
        }

        @media (max-width: 768px) {
            h2 {
                font-size: 2rem;
                margin-bottom: 30px;
            }
            .hero-content h1 {
                font-size: 2.5rem;
            }
            .hero-content p {
                font-size: 1.05rem;
            }
            .project-grid {
                grid-template-columns: 1fr;
            }
            section {
                padding: 50px 0;
            }
        }
    </style>
</head>
<body>

    <header>
        <div class="container">
            <div class="logo">Codify.</div>
            <nav>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="hero-content">
            <h1>Crafting Digital Experiences Through Code.</h1>
            <p>I build interactive, aesthetically pleasing, and highly performant creative coding projects.</p>
            <a href="#projects" class="btn">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                <!-- Project Card 1 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/3a7bd5/ffffff?text=Generative+Art" alt="Generative Art Project">
                    <div class="project-info">
                        <h3>Generative Canvas</h3>
                        <p>A real-time visualization using p5.js and complex mathematical functions.</p>
                        <a href="#" class="btn" style="padding: 8px 20px; font-size: 0.9rem;">View Code</a>
                    </div>
                </div>
                <!-- Project Card 2 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/ff00cc/ffffff?text=Web+Interaction" alt="Web Interaction Project">
                    <div class="project-info">
                        <h3>Interactive Scroller</h3>
                        <p>Smooth, physics-based scrolling animations with scroll-jacking effects.</p>
                        <a href="#" class="btn" style="padding: 8px 20px; font-size: 0.9rem;">View Code</a>
                    </div>
                </div>
                <!-- Project Card 3 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/3333ff/ffffff?text=Data+Visualization" alt="Data Visualization Project">
                    <div class="project-info">
                        <h3>Network Flow Map</h3>
                        <p>Visualizing large datasets into an understandable, dynamic node graph.</p>
                        <a href="#" class="btn" style="padding: 8px 20px; font-size: 0.9rem;">View Code</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-form-wrapper">
                <form action="#" method="POST">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your Name" required>

                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="your.email@example.com" required>

                    <label for="message">Message</label>
                    <textarea id="message" name="message" placeholder="Tell me about your project idea..." required></textarea>

                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 Codify Portfolio. Crafted with Code.</p>
            <div class="social-links">
                <a href="#" aria-label="GitHub">GitHub</a>
                <span style="color: #ccc;">|</span>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
                <span style="color: #ccc;">|</span>
                <a href="mailto:contact@example.com" aria-label="Email">Email</a>
            </div>
        </div>
    </footer>

    <script>
        // Simple JS for smooth scrolling (optional, as CSS handles basic scrolling)
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
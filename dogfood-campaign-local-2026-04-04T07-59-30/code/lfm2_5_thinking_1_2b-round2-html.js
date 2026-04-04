<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio | [Your Name]</title>
    <style>
        /* --- Global Styles & Reset --- */
        :root {
            --primary-color: #3498db;
            --secondary-color: #2ecc71;
            --dark-bg: #1c1c1e;
            --light-text: #ecf0f1;
            --card-bg: #2c2c34;
            --gradient-start: #9b59b6;
            --gradient-end: #3498db;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--dark-bg);
            color: var(--light-text);
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--primary-color);
            transition: color 0.3s ease;
        }

        a:hover {
            color: var(--secondary-color);
        }

        /* --- Utility Classes --- */
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }

        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
        }

        /* --- Navigation --- */
        header {
            background: rgba(28, 28, 30, 0.95);
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
            padding: 0;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 900;
            color: var(--light-text);
        }

        nav a {
            margin-left: 25px;
            color: var(--light-text);
            font-weight: 500;
        }

        nav a:hover {
            color: var(--primary-color);
        }

        /* --- Hero Section (Animated Background) --- */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(-45deg, var(--gradient-start), var(--gradient-end), #e74c3c, #f39c12);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            padding: 0; /* Overrides container padding */
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            padding: 20px;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, var(--light-text), var(--primary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-content p {
            font-size: 1.5rem;
            margin-bottom: 40px;
            color: #ddd;
        }

        /* --- Section Styling --- */
        section {
            padding: 80px 0;
        }

        h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: var(--light-text);
            position: relative;
        }

        h2::after {
            content: '';
            display: block;
            width: 70px;
            height: 4px;
            background-color: var(--primary-color);
            margin: 10px auto 0;
            border-radius: 2px;
        }

        /* --- Project Cards --- */
        #projects {
            background-color: var(--dark-bg);
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background-color: var(--card-bg);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            padding-bottom: 20px;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background-color: #3a3a40;
        }

        .project-info {
            padding: 0 20px;
        }

        .project-info h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
            font-size: 1.5rem;
        }

        .project-info p {
            margin-bottom: 15px;
            color: #aaa;
        }

        .project-links a {
            margin-right: 15px;
            font-size: 0.9rem;
        }

        /* --- Contact Form --- */
        #contact {
            background-color: var(--card-bg);
            text-align: center;
        }

        #contact form {
            max-width: 600px;
            margin: 0 auto;
            text-align: left;
            padding: 30px;
            background: var(--dark-bg);
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: var(--light-text);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: #222;
            color: var(--light-text);
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
        }

        /* --- Footer --- */
        footer {
            text-align: center;
            padding: 20px 0;
            background-color: #111;
            border-top: 1px solid #333;
            font-size: 0.9rem;
            color: #aaa;
        }

        /* --- Responsiveness --- */
        @media (max-width: 768px) {
            .hero-content h1 {
                font-size: 3rem;
            }

            .hero-content p {
                font-size: 1.2rem;
            }

            /* Navbar stacking */
            header .container {
                flex-direction: column;
                gap: 15px;
            }

            nav {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }
            nav a {
                margin: 5px 10px;
                padding: 5px 0;
            }

            /* Section padding adjustment */
            section {
                padding: 60px 0;
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
    </style>
</head>
<body>

    <!-- Navigation Bar -->
    <header>
        <div class="container">
            <div class="logo">CODE.PORTFOLIO</div>
            <nav>
                <a href="#hero">Home</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="hero-content">
            <h1>JANE DOE</h1>
            <p>Crafting interactive digital experiences through code and creativity. Full-Stack Developer & Creative Coder.</p>
            <a href="#projects" class="btn">View Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                
                <!-- Project Card 1 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x200/34495e/ffffff?text=Data+Visualization" alt="Project 1 Image">
                    <div class="project-info">
                        <h3>Generative Art Engine</h3>
                        <p>A real-time visualization tool using p5.js to render complex geometric patterns.</p>
                        <div class="project-links">
                            <a href="#" target="_blank">Live Demo</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x200/2980b9/ffffff?text=Interactive+Website" alt="Project 2 Image">
                    <div class="project-info">
                        <h3>E-Commerce Micro-Site</h3>
                        <p>A responsive e-commerce platform built with React and styled components.</p>
                        <div class="project-links">
                            <a href="#" target="_blank">View Site</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x200/e67e22/ffffff?text=Web+Game" alt="Project 3 Image">
                    <div class="project-info">
                        <h3>Procedural Dungeon Crawler</h3>
                        <p>A fun, browser-based game utilizing procedural generation algorithms.</p>
                        <div class="project-links">
                            <a href="#" target="_blank">Play Game</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>

                <!-- Project Card 4 (Optional) -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x200/27ae60/ffffff?text=API+Integration" alt="Project 4 Image">
                    <div class="project-info">
                        <h3>Weather Dashboard API</h3>
                        <p>A data-driven dashboard integrating multiple third-party APIs seamlessly.</p>
                        <div class="project-links">
                            <a href="#" target="_blank">Live Demo</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
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
                    <textarea id="message" name="message" rows="6" required></textarea>
                </div>
                <button type="submit" class="btn">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 Jane Doe Portfolio. Crafted with Code & Passion.</p>
            <p style="margin-top: 10px;">| Built using HTML, CSS, and JavaScript.</p>
        </div>
    </footer>

    <script>
        // Simple JavaScript for smooth scrolling (optional, but good practice)
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
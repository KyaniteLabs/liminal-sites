<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* General Styles */
        :root {
            --primary-color: #ff6b6b;
            --secondary-color: #4ecdc4;
            --text-dark: #1a1a1a;
            --text-light: #f4f4f4;
            --bg-dark: #121212;
            --card-bg: #1e1e1e;
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
            color: var(--secondary-color);
            transition: color 0.3s ease;
        }

        a:hover {
            color: var(--primary-color);
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: auto;
            padding: 20px 0;
        }

        /* Header & Navigation */
        header {
            background: rgba(18, 18, 18, 0.9);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
        }

        .logo {
            font-size: 1.8em;
            font-weight: 700;
            color: var(--secondary-color);
        }

        .nav-links a {
            margin-left: 25px;
            font-size: 1.1em;
            color: var(--text-light);
        }

        /* Hero Section */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* Animated Gradient Background */
            background: linear-gradient(135deg, #1e3c72, #255a89, #1e3c72);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
            padding: 40px 0;
            position: relative;
            overflow: hidden;
        }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            animation: fadeIn 1.5s ease-out;
        }

        .hero-content h1 {
            font-size: 3.5em;
            margin-bottom: 20px;
            background: linear-gradient(45deg, var(--text-light), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-content p {
            font-size: 1.3em;
            margin-bottom: 30px;
            color: #ccc;
        }

        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(45deg, var(--primary-color), #ff9a9a);
            border: none;
            border-radius: 50px;
            color: var(--text-dark);
            font-size: 1.1em;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(255, 107, 107, 0.6);
        }

        /* Section Styling */
        section {
            padding: 80px 0;
        }

        h2 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 40px;
            color: var(--secondary-color);
            position: relative;
        }

        h2::after {
            content: '';
            display: block;
            width: 60px;
            height: 3px;
            background: var(--primary-color);
            margin: 10px auto 0;
        }

        /* Projects Section */
        #projects {
            background-color: #151515;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-top: 3px solid transparent;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border-top-color: var(--secondary-color);
        }

        .project-card-inner {
            padding: 20px;
        }

        .project-card h3 {
            color: var(--secondary-color);
            margin-bottom: 10px;
        }

        .project-card p {
            color: #aaa;
            margin-bottom: 15px;
        }

        .project-card .tags span {
            display: inline-block;
            background: #333;
            color: #ccc;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8em;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        .project-card a.view-btn {
            display: block;
            text-align: center;
            padding: 10px 0;
            background: var(--primary-color);
            color: var(--text-dark);
            text-transform: uppercase;
            font-weight: bold;
            border-radius: 5px;
            transition: background 0.3s;
        }

        .project-card a.view-btn:hover {
            background: #ff8282;
        }

        /* Contact Form Section */
        #contact {
            background-color: var(--bg-dark);
            text-align: center;
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            text-align: left;
        }

        .contact-form-container h2 {
            text-align: left;
            margin-bottom: 30px;
        }

        .contact-form-container form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-group {
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--secondary-color);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 5px;
            background-color: #2a2a2a;
            color: var(--text-light);
            font-size: 1em;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        .submit-button {
            background: linear-gradient(45deg, var(--secondary-color), #5fa9a7);
            border: none;
            padding: 15px;
            color: var(--text-dark);
            font-size: 1.1em;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s, transform 0.2s;
            margin-top: 10px;
        }

        .submit-button:hover {
            background: #43a9a7;
            transform: scale(1.02);
        }

        /* Footer */
        footer {
            background-color: #121212;
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #222;
        }

        footer p {
            margin: 0;
            font-size: 0.9em;
            color: #888;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 2.8em;
            }
            .hero-content p {
                font-size: 1.1em;
            }
        }

        @media (max-width: 600px) {
            nav {
                flex-direction: column;
                padding: 10px 0;
            }
            .nav-links {
                margin-top: 10px;
            }
            .nav-links a {
                margin: 0 10px;
                font-size: 1em;
            }
            .hero-content h1 {
                font-size: 2.5em;
            }
            .hero-content p {
                font-size: 1em;
            }
            section {
                padding: 50px 0;
            }
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
                <div class="logo">CodeFlow.dev</div>
                <div class="nav-links">
                    <a href="#hero">Home</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                    <a href="#" class="cta-button" style="padding: 8px 15px; font-size: 1em;">Resume</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="container hero-content">
            <h1>Crafting Experiences with Code</h1>
            <p>I build interactive, visually stunning, and performant digital art and web experiences using creative coding principles.</p>
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
                    <div class="project-card-inner">
                        <h3>Generative Art System</h3>
                        <p>An interactive visualization using p5.js simulating complex natural patterns.</p>
                        <div class="tags">
                            <span>p5.js</span>
                            <span>WebGL</span>
                            <span>Math</span>
                        </div>
                        <a href="#" class="view-btn">View Project</a>
                    </div>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <div class="project-card-inner">
                        <h3>Real-time Data Visualizer</h3>
                        <p>Dashboard displaying live stock market data with smooth animated transitions.</p>
                        <div class="tags">
                            <span>D3.js</span>
                            <span>React</span>
                            <span>APIs</span>
                        </div>
                        <a href="#" class="view-btn">View Project</a>
                    </div>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <div class="project-card-inner">
                        <h3>Procedural Game Level</h3>
                        <p>Building complex, endless environments using cellular automata algorithms.</p>
                        <div class="tags">
                            <span>JavaScript</span>
                            <span>Canvas</span>
                            <span>Algorithms</span>
                        </div>
                        <a href="#" class="view-btn">View Project</a>
                    </div>
                </div>

                <!-- Project Card 4 (Extra for responsiveness) -->
                <div class="project-card">
                    <div class="project-card-inner">
                        <h3>Interactive Soundscape</h3>
                        <p>A generative audio experience reacting to mouse movements and environmental input.</p>
                        <div class="tags">
                            <span>Web Audio API</span>
                            <span>p5.js</span>
                            <span>Audio</span>
                        </div>
                        <a href="#" class="view-btn">View Project</a>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
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
                    <button type="submit" class="submit-button">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 CodeFlow Portfolio. Built with Passion and Code.</p>
        </div>
    </footer>

    <script>
        // Simple JavaScript for minor interactions (optional, but good practice)
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', function() {
                // Example: Smooth scroll to section if not already handled by anchor links
            });
        });
    </script>
</body>
</html>
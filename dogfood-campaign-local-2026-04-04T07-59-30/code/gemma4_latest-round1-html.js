<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* Basic Reset and Variables */
        :root {
            --primary-color: #3f51b5;
            --secondary-color: #ff4081;
            --text-dark: #212121;
            --text-light: #ffffff;
            --bg-gradient-start: #00c6ff;
            --bg-gradient-end: #0072ff;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            background-color: #f4f7f9;
            color: var(--text-dark);
        }

        /* Utility Classes */
        .container {
            width: 90%;
            max-width: 1200px;
            margin: auto;
            padding: 40px 0;
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 40px;
            color: var(--text-dark);
            position: relative;
            padding-bottom: 10px;
        }

        .section-title::after {
            content: '';
            width: 60px;
            height: 3px;
            background: var(--secondary-color);
            display: block;
            margin: 10px auto;
        }

        /* Header/Navigation */
        header {
            background: rgba(255, 255, 255, 0.95);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 90%;
            max-width: 1200px;
            margin: auto;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary-color);
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-dark);
            margin-left: 25px;
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--secondary-color);
        }

        /* Hero Section */
        #hero {
            background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
            height: 80vh;
            display: flex;
            align-items: center;
            text-align: center;
            color: var(--text-light);
            position: relative;
            overflow: hidden;
        }

        #hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 40%);
            animation: shine 15s linear infinite;
            pointer-events: none;
        }

        @keyframes shine {
            0% { transform: translate(-100%) 0; }
            100% { transform: translate(100%) 0; }
        }

        .hero-content {
            max-width: 800px;
            padding: 20px;
            z-index: 1;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            font-weight: 800;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        }

        .hero-content p {
            font-size: 1.4rem;
            margin-bottom: 40px;
            opacity: 0.9;
        }

        .cta-button {
            background-color: var(--secondary-color);
            color: var(--text-light);
            padding: 12px 30px;
            border: none;
            border-radius: 30px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4);
        }

        .cta-button:hover {
            background-color: #e91e63;
            transform: translateY(-3px);
        }

        /* Projects Section */
        #projects {
            background-color: #ffffff;
            padding: 80px 0;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background-color: #eee;
        }

        .card-content {
            padding: 20px;
        }

        .card-content h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .card-content p {
            margin-bottom: 15px;
            color: #666;
        }

        .card-links a {
            display: inline-block;
            margin-right: 15px;
            color: var(--secondary-color);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: color 0.2s;
        }

        .card-links a:hover {
            color: var(--primary-color);
        }

        /* Contact Section */
        #contact {
            background-color: #e8eaf6;
            padding: 80px 0;
            text-align: center;
        }

        #contact form {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            text-align: left;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--primary-color);
        }

        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 5px rgba(63, 81, 181, 0.3);
        }

        textarea {
            resize: vertical;
            min-height: 120px;
        }

        .submit-button {
            background-color: var(--primary-color);
            color: var(--text-light);
            padding: 12px 25px;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: background-color 0.3s, transform 0.2s;
            width: 100%;
        }

        .submit-button:hover {
            background-color: #303f9f;
            transform: translateY(-2px);
        }

        /* Footer */
        footer {
            background-color: var(--text-dark);
            color: #ccc;
            text-align: center;
            padding: 30px 0;
            font-size: 0.9rem;
        }

        footer a {
            color: var(--secondary-color);
            text-decoration: none;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 3rem;
            }
            .hero-content p {
                font-size: 1.2rem;
            }
        }

        @media (max-width: 600px) {
            nav {
                flex-direction: column;
                gap: 15px;
            }
            .nav-links a {
                margin: 5px 10px;
                display: inline-block;
            }
            .hero-content h1 {
                font-size: 2.5rem;
            }
            .hero-content p {
                font-size: 1.1rem;
            }
            .section-title {
                font-size: 2rem;
            }
        }
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" type="text/css">
</style>
</head>
<body>

    <!-- Navigation -->
    <header>
        <nav class="container">
            <div class="logo">CodeCraft.dev</div>
            <div class="nav-links">
                <a href="#hero">Home</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="container hero-content">
            <h1>Hi, I'm Alex. Creative Coder.</h1>
            <p>Building interactive digital experiences that blend art, technology, and computation.</p>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="project-grid">
                <!-- Project Card 1 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/3f51b5/ffffff?text=Generative+Art" alt="Generative Art Project">
                    <div class="card-content">
                        <h3>Algorithmic Bloom</h3>
                        <p>A visualization piece using p5.js to generate complex, evolving floral patterns based on noise functions.</p>
                        <div class="card-links">
                            <a href="#" target="_blank">Live Demo</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/ff4081/ffffff?text=Interactive+Web+App" alt="Interactive Web App Project">
                    <div class="card-content">
                        <h3>Spatial Data Mapper</h3>
                        <p>An interactive map interface built with Three.js, allowing users to explore simulated 3D data points.</p>
                        <div class="card-links">
                            <a href="#" target="_blank">Live Demo</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/4caf50/ffffff?text=Audio-Reactive+Visuals" alt="Audio Reactive Project">
                    <div class="card-content">
                        <h3>Sound Weaver</h3>
                        <p>Visualizer that reacts in real-time to input audio frequencies, creating syncing graphical outputs.</p>
                        <div class="card-links">
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
            <h2 class="section-title">Get In Touch</h2>
            <form action="#" method="POST">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required placeholder="Your Full Name">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="you@example.com">
                </div>
                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required placeholder="Inquiry about a project or collaboration">
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" required placeholder="Tell me about your vision..."></textarea>
                </div>
                <button type="submit" class="submit-button">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; <span id="year"></span> CodeCraft Portfolio. Crafted with creativity and code.</p>
            <p style="margin-top: 10px;">&copy; <a href="#contact">Contact</a> | &copy; <a href="https://github.com/yourprofile" target="_blank">GitHub</a></p>
        </div>
    </footer>

    <script>
        // JavaScript for dynamic elements
        document.getElementById('year').textContent = new Date().getFullYear();

        // Simple smooth scrolling for navigation
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
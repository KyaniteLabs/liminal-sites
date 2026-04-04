<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* Global Styles */
        :root {
            --primary-color: #3b82f6;
            --secondary-color: #10b981;
            --background-dark: #111827;
            --text-light: #f3f4f6;
            --card-bg: #1f2937;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--background-dark);
            color: var(--text-light);
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--text-light);
            transition: color 0.3s ease;
        }

        a:hover {
            color: var(--primary-color);
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }

        /* Utility Classes */
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.6);
        }

        /* Header and Navigation */
        header {
            background-color: rgba(17, 24, 39, 0.9);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 800;
            letter-spacing: 1px;
        }

        .nav-links a {
            margin-left: 25px;
            font-size: 1rem;
        }

        /* Hero Section */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
            /* Animated Gradient Background Setup */
            background: linear-gradient(135deg, #1e3a8a, #1d4ed8, #4f46e5);
            background-size: 300% 300%;
            animation: gradientAnimation 15s ease infinite;
        }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.4); /* Slight overlay for readability */
            border-radius: 15px;
            backdrop-filter: blur(5px);
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            line-height: 1.1;
        }

        .hero-content p {
            font-size: 1.3rem;
            margin-bottom: 40px;
            color: #cbd5e1;
        }

        /* Section Styling */
        section {
            padding: 80px 0;
        }

        h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            position: relative;
        }
        
        h2::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            margin: 10px auto 0;
            border-radius: 2px;
        }

        /* Project Cards */
        #projects {
            background-color: #111827;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background-color: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-top: 3px solid var(--primary-color);
        }

        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3);
        }

        .project-card-content {
            padding: 25px;
        }

        .project-card h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
            font-size: 1.5rem;
        }

        .project-card p {
            margin-bottom: 15px;
            color: #9ca3af;
        }
        
        .project-tags span {
            display: inline-block;
            background-color: #374151;
            color: #9ca3af;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        /* Contact Form */
        #contact {
            background-color: #1f2937;
            text-align: center;
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: var(--card-bg);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: left;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #ccc;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #4b5563;
            border-radius: 8px;
            background-color: #1f2937;
            color: var(--text-light);
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
        }

        textarea {
            resize: vertical;
            min-height: 120px;
        }

        /* Footer */
        footer {
            background-color: #0f172a;
            text-align: center;
            padding: 25px 0;
            border-top: 1px solid #1e293b;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 2.8rem;
            }
            .hero-content p {
                font-size: 1.1rem;
            }
            .nav-links a {
                margin-left: 15px;
                font-size: 0.9rem;
            }
        }

        @media (max-width: 600px) {
            .nav-links {
                display: none; /* Simple mobile nav toggle needed for production */
            }
            nav {
                justify-content: center;
            }
            .hero-content h1 {
                font-size: 2.5rem;
            }
            .hero-content p {
                font-size: 1rem;
            }
            h2 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>

    <!-- Navigation Bar -->
    <header>
        <div class="container">
            <nav>
                <div class="logo">CodeCraft.dev</div>
                <div class="nav-links">
                    <a href="#projects">Projects</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="hero-content">
            <h1 class="animate-text">Building Digital Experiences with Code & Creativity</h1>
            <p>I transform complex logic into beautiful, interactive, and performant web art. Specializing in generative design and immersive web applications.</p>
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
                    <div class="project-card-content">
                        <h3>Interactive Data Visualization</h3>
                        <p>A real-time visualization tool mapping global climate data using WebGL and Three.js.</p>
                        <div class="project-tags">
                            <span>Three.js</span>
                            <span>WebGL</span>
                            <span>D3.js</span>
                        </div>
                        <div style="margin-top: 20px;"><a href="#" class="btn" style="padding: 10px 20px; font-size: 0.9rem;">View Project</a></div>
                    </div>
                </div>

                <!-- Project Card 2 -->
                <div class="project-card">
                    <div class="project-card-content">
                        <h3>Generative Art Portfolio</h3>
                        <p>An algorithmically generated collection of abstract pieces based on Perlin noise functions.</p>
                        <div class="project-tags">
                            <span>p5.js</span>
                            <span>JavaScript</span>
                            <span>Canvas</span>
                        </div>
                        <div style="margin-top: 20px;"><a href="#" class="btn" style="padding: 10px 20px; font-size: 0.9rem;">View Project</a></div>
                    </div>
                </div>

                <!-- Project Card 3 -->
                <div class="project-card">
                    <div class="project-card-content">
                        <h3>Immersive Web Experience</h3>
                        <p>A single-page narrative built with scroll-jacking and custom CSS animations for storytelling.</p>
                        <div class="project-tags">
                            <span>GSAP</span>
                            <span>CSS</span>
                            <span>HTML5</span>
                        </div>
                        <div style="margin-top: 20px;"><a href="#" class="btn" style="padding: 10px 20px; font-size: 0.9rem;">View Project</a></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About/Skills Section (Simplified for brevity, using structure) -->
    <section id="about" style="background-color: #0f172a;">
        <div class="container">
            <h2>About Me</h2>
            <div style="max-width: 800px; margin: 0 auto; text-align: center; padding: 20px; border-radius: 10px; background-color: #1f2937;">
                <p style="font-size: 1.2rem; margin-bottom: 20px;">I am a creative developer passionate about the intersection of code, art, and user experience. My goal is to build digital interfaces that don't just function, but also evoke emotion.</p>
                <p style="margin-bottom: 30px;"><strong>Core Skills:</strong> JavaScript (React, Three.js), p5.js, HTML5, CSS3 (SASS, Grid/Flexbox), Node.js.</p>
                <a href="#" class="btn" style="background: #4b5563; box-shadow: none;">Download Resume</a>
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
                        <label for="message">Message</label>
                        <textarea id="message" name="message" required></textarea>
                    </div>
                    <button type="submit" class="btn" style="width: 100%;">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2024 CodeCraft Portfolio. Built with Creativity and Code.</p>
    </footer>

    <script>
        // Simple JS for potential interactivity enhancement (e.g., scroll effects, form handling)
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Prevent default link behavior if it's an anchor tag used as a button
                if (e.target.closest('a')) {
                    // Optional: Add scroll animation class here if needed
                }
            });
        });
    </script>
</body>
</html>
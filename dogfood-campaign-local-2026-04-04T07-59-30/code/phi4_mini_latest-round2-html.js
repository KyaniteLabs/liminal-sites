<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* Basic Reset and Global Styles */
        :root {
            --primary-color: #6a11cb;
            --secondary-color: #2575fc;
            --text-dark: #1a1a1a;
            --text-light: #f4f4f9;
            --bg-light: #ffffff;
            --bg-dark: #0d1117;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            color: var(--text-dark);
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        /* Utility Classes */
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }

        .btn {
            display: inline-block;
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-align: center;
            border: none;
            cursor: pointer;
        }

        .btn-primary {
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            color: var(--text-light);
            box-shadow: 0 8px 20px rgba(106, 17, 203, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 25px rgba(37, 117, 252, 0.6);
        }

        /* Header and Navigation */
        header {
            background-color: var(--bg-light);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            position: sticky;
            top: 0;
            z-index: 1000;
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
            color: var(--primary-color);
        }

        .nav-links a {
            margin-left: 25px;
            font-size: 1rem;
            color: var(--text-dark);
            transition: color 0.2s;
        }

        .nav-links a:hover {
            color: var(--secondary-color);
        }

        /* Hero Section */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            text-align: center;
            /* Animated Gradient Background */
            background: linear-gradient(-45deg, var(--primary-color), var(--secondary-color), #ff6b81, #4ecdc4);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
        }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            margin: 0 auto;
            color: var(--text-light);
        }

        .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 15px;
            animation: fadeInDown 1s ease-out;
        }

        .hero-content p {
            font-size: 1.4rem;
            margin-bottom: 30px;
            animation: fadeInUp 1.2s ease-out;
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
            display: inline-block;
        }

        h2::after {
            content: '';
            width: 60px;
            height: 4px;
            background-color: var(--secondary-color);
            display: block;
            margin: 10px auto 0;
        }

        /* Projects Section */
        #projects {
            background-color: #f0f2f5;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 20px 0;
        }

        .project-card {
            background: var(--bg-light);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
            cursor: pointer;
        }

        .project-card:hover {
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 15px 40px rgba(106, 17, 203, 0.2);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
            filter: grayscale(10%);
            transition: filter 0.3s;
        }
        
        .project-card:hover img {
            filter: grayscale(0%);
        }

        .card-content {
            padding: 20px;
        }

        .card-content h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .card-content p {
            color: #666;
            margin-bottom: 15px;
        }

        /* Contact Form Section */
        #contact {
            background-color: var(--bg-dark);
            color: var(--text-light);
            text-align: center;
        }

        #contact h2 {
            color: var(--text-light);
        }

        #contact h2::after {
            background-color: var(--secondary-color);
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            text-align: left;
        }

        .contact-form-container form {
            display: grid;
            gap: 20px;
        }

        .form-group {
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #ccc;
        }

        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 8px;
            background-color: #2c3e50;
            color: var(--text-light);
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--secondary-color);
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 117, 252, 0.3);
        }

        /* Footer */
        footer {
            background-color: #1a1a2e;
            color: #aaa;
            text-align: center;
            padding: 30px 0;
            font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 2.8rem;
            }
            .hero-content p {
                font-size: 1.2rem;
            }
            .nav-links {
                display: none; /* Simple mobile nav toggle would be better, but keeping it simple for this example */
            }
            nav {
                padding: 10px 0;
            }
            .logo {
                font-size: 1.6rem;
            }
        }

        @media (max-width: 600px) {
            h2 {
                font-size: 2rem;
            }
            .container {
                padding: 30px 0;
            }
            .btn {
                padding: 10px 25px;
                font-size: 0.9rem;
            }
        }

        /* Keyframe Animations */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

    </style>
</head>
<body>

    <!-- Header & Navigation -->
    <header>
        <div class="container">
            <nav>
                <div class="logo">Coder<span style="color: var(--secondary-color);">.dev</span></div>
                <div class="nav-links">
                    <a href="#projects">Projects</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <a href="#" class="btn btn-primary" style="padding: 8px 20px; margin-left: 20px;">Resume</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="container hero-content">
            <h1>Hi, I'm Alex. Creative Coder & Digital Artist.</h1>
            <p>Building interactive, data-driven, and visually stunning experiences using code.</p>
            <a href="#projects" class="btn btn-primary">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="container">
        <h2>Featured Projects</h2>
        <div class="project-grid">
            <!-- Project Card 1 -->
            <div class="project-card">
                <img src="https://picsum.photos/id/1015/600/400" alt="Generative Art">
                <div class="card-content">
                    <h3>Generative Landscape</h3>
                    <p>An interactive piece using p5.js to create evolving, procedural art forms.</p>
                    <a href="#" style="color: var(--primary-color); font-weight: 600;">View Live →</a>
                </div>
            </div>
            <!-- Project Card 2 -->
            <div class="project-card">
                <img src="https://picsum.photos/id/1025/600/400" alt="Data Visualization">
                <div class="card-content">
                    <h3>Global Data Stream</h3>
                    <p>Real-time visualization of global climate data using D3.js and WebSockets.</p>
                    <a href="#" style="color: var(--primary-color); font-weight: 600;">View Live →</a>
                </div>
            </div>
            <!-- Project Card 3 -->
            <div class="project-card">
                <img src="https://picsum.photos/id/1039/600/400" alt="Web Animation">
                <div class="card-content">
                    <h3>Micro-Interaction Site</h3>
                    <p>A complex UI built with GSAP, focusing on smooth, delightful user transitions.</p>
                    <a href="#" style="color: var(--primary-color); font-weight: 600;">View Live →</a>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section (Placeholder for completeness) -->
    <section id="about" class="container">
        <h2 style="color: var(--text-dark);">About Me</h2>
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 20px;">
                I am a passionate developer dedicated to the intersection of art and computation. My expertise lies in transforming complex data sets and abstract concepts into beautiful, functional, and highly performant web experiences. I thrive in environments where creativity meets technical rigor.
            </p>
            <p style="font-size: 1.1rem; line-height: 1.7;">
                When I'm not coding, I'm exploring physical computing and experimental media. Let's build something unforgettable together.
            </p>
            <div style="margin-top: 30px;">
                <a href="#" class="btn" style="background-color: #ccc; color: var(--text-dark); margin-right: 15px;">LinkedIn</a>
                <a href="#" class="btn" style="background-color: #333; color: white;">GitHub</a>
            </div>
        </div>
    </section>


    <!-- Contact Form Section -->
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
                        <label for="message">Project Details / Message</label>
                        <textarea id="message" name="message" rows="6" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 Alex. Built with <span style="color: var(--secondary-color);">Code</span> & Creativity.</p>
        </div>
    </footer>

    <script>
        // Simple JavaScript for smooth scrolling on anchor clicks (optional enhancement)
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
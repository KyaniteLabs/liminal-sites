<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeCanvas | Creative Coding Portfolio</title>
    <style>
        /* Global Reset and Variables */
        :root {
            --primary-color: #6a11cb;
            --secondary-color: #2575fc;
            --dark-bg: #121212;
            --light-text: #e0e0e0;
            --card-bg: #1e1e1e;
            --accent-color: #ff5722;
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
            color: var(--secondary-color);
        }

        /* Utility Classes */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            overflow: hidden;
        }

        .btn {
            display: inline-block;
            padding: 12px 25px;
            border-radius: 30px;
            transition: all 0.3s ease;
            text-align: center;
            border: none;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-primary {
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            color: white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(90, 17, 203, 0.5);
        }
        
        /* Header/Navigation */
        header {
            background: rgba(18, 18, 18, 0.9);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
        }

        .logo {
            font-size: 1.8em;
            font-weight: 700;
            color: var(--light-text);
        }

        nav a {
            margin-left: 25px;
            font-size: 1.1em;
            color: var(--light-text);
            transition: color 0.3s ease;
        }

        nav a:hover {
            color: var(--secondary-color);
        }

        /* Hero Section */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* Animated Gradient Background */
            background: linear-gradient(-45deg, var(--primary-color), #ff5722, var(--secondary-color), var(--primary-color));
            background-size: 400% 400%;
            animation: gradientBackground 15s ease infinite;
            padding: 40px 0;
            position: relative;
            overflow: hidden;
            /* Adding a subtle overlay for text readability */
            box-shadow: inset 0 -20px 50px rgba(0, 0, 0, 0.2);
        }

        @keyframes gradientBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            padding: 20px;
        }

        .hero-content h1 {
            font-size: 4em;
            margin-bottom: 10px;
            animation: fadeInDown 1s ease-out;
        }

        .hero-content p {
            font-size: 1.5em;
            margin-bottom: 30px;
            opacity: 0;
            animation: fadeIn 1.5s ease-out forwards;
        }

        /* Projects Section */
        #projects {
            padding: 100px 0;
            background-color: #181818;
            text-align: center;
        }

        #projects h2 {
            font-size: 2.5em;
            margin-bottom: 50px;
            color: var(--light-text);
            position: relative;
        }

        #projects h2::after {
            content: '';
            display: block;
            width: 60px;
            height: 3px;
            background-color: var(--secondary-color);
            margin: 10px auto;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding-top: 40px;
        }

        .project-card {
            background-color: var(--card-bg);
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-align: left;
            transition-delay: 0.1s;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(90, 17, 203, 0.4);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            filter: brightness(0.8);
            transition: filter 0.3s ease;
        }

        .project-card:hover img {
            filter: brightness(1);
        }

        .card-content {
            padding: 20px;
        }

        .card-content h3 {
            color: var(--secondary-color);
            margin-bottom: 10px;
        }

        .card-content p {
            margin-bottom: 15px;
            color: #aaa;
        }

        .card-content a {
            display: inline-block;
            color: var(--accent-color);
            font-weight: 600;
            padding: 5px 0;
        }

        /* Contact Section */
        #contact {
            padding: 100px 0;
            background-color: #121212;
            text-align: center;
        }

        #contact h2 {
            font-size: 2.5em;
            margin-bottom: 40px;
            color: var(--light-text);
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--light-text);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 8px;
            background-color: #222;
            color: var(--light-text);
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--secondary-color);
            outline: none;
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        /* Footer */
        footer {
            background-color: #0a0a0a;
            color: #888;
            text-align: center;
            padding: 20px 0;
            font-size: 0.9em;
            border-top: 1px solid #222;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Media Queries for Responsiveness */
        @media (max-width: 768px) {
            header .container {
                flex-direction: column;
                padding: 15px 10px;
            }
            
            nav {
                margin-top: 15px;
            }

            nav a {
                margin: 0 10px;
                font-size: 1em;
            }

            .hero-content h1 {
                font-size: 3em;
            }

            .hero-content p {
                font-size: 1.2em;
            }

            .project-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <!-- Header/Navigation -->
    <header>
        <div class="container">
            <div class="logo">CodeCanvas.dev</div>
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
            <h1>Building Digital Worlds with Code.</h1>
            <p>I am a creative developer specializing in generative art, interactive experiences, and full-stack web solutions.</p>
            <a href="#projects" class="btn btn-primary">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                
                <!-- Project 1 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/333333/ffffff?text=Generative+Art" alt="Generative Art">
                    <div class="card-content">
                        <h3>Neural Cityscape</h3>
                        <p>An interactive visualization using p5.js and machine learning models to generate evolving urban landscapes.</p>
                        <a href="#" target="_blank">View Live Demo &rarr;</a>
                    </div>
                </div>

                <!-- Project 2 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/333333/ffffff?text=Interactive+Web+App" alt="Interactive Web App">
                    <div class="card-content">
                        <h3>Quantum Dashboard</h3>
                        <p>A complex, real-time data visualization dashboard built with React and WebSockets for simulated quantum data.</p>
                        <a href="#" target="_blank">View Code &rarr;</a>
                    </div>
                </div>

                <!-- Project 3 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/600x400/333333/ffffff?text=Sound+Visualizer" alt="Sound Visualizer">
                    <div class="card-content">
                        <h3>Ambient Sound Visualizer</h3>
                        <p>React Three Fiber project visualizing audio input in 3D space using Web Audio API.</p>
                        <a href="#" target="_blank">Watch Video &rarr;</a>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Ready to Collaborate?</h2>
            <p style="margin-bottom: 40px; color: #ccc;">Whether you have a unique idea or need to bring a project to life, let's talk.</p>
            
            <div class="contact-form-container">
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

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2023 CodeCanvas Portfolio. Developed with passion and code.</p>
        </div>
    </footer>

    <script>
        // Simple form submission handler to prevent default and simulate success
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const button = this.querySelector('.btn-primary');
            
            // Simulate API call delay
            button.textContent = 'Sending...';
            button.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully. I will get back to you soon.');
                this.reset();
                button.textContent = 'Send Message';
                button.disabled = false;
            }, 1500);
        });
    </script>
</body>
</html>
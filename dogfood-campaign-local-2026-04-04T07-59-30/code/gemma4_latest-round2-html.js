<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* Basic Reset and Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #121212;
            color: #e0e0e0;
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 0;
        }

        /* Utility Classes */
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 40px;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* Navbar */
        header {
            background: rgba(18, 18, 18, 0.95);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 70px;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: #6a11cb;
        }

        .nav-links a {
            margin-left: 25px;
            font-size: 1rem;
            transition: color 0.3s;
            padding: 5px 0;
        }

        .nav-links a:hover {
            color: #ff7e50;
        }

        /* Hero Section */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* Animated Gradient Background */
            background: linear-gradient(135deg, #1a0033, #00001a, #330066);
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
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            color: #ffffff;
            animation: fadeInDown 1s ease-out;
        }

        .hero-content p {
            font-size: 1.4rem;
            margin-bottom: 30px;
            color: #cccccc;
            animation: fadeIn 1.5s ease-out;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(45deg, #ff7e50, #6a11cb);
            padding: 12px 35px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            animation: fadeInUp 2s ease-out;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(255, 126, 80, 0.3);
        }

        /* Projects Section */
        #projects {
            padding: 80px 0;
            background-color: #1e1e1e;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background: #2a2a2a;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s, box-shadow 0.3s;
            border-top: 3px solid transparent;
            transition-all: all 0.3s ease;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(99, 179, 255, 0.2);
            border-top-color: #6a11cb;
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            filter: grayscale(10%);
            transition: filter 0.3s;
        }

        .project-card:hover img {
            filter: grayscale(0);
        }

        .card-info {
            padding: 20px;
        }

        .card-info h3 {
            color: #ff7e50;
            margin-bottom: 10px;
        }

        .card-info p {
            margin-bottom: 15px;
            color: #aaaaaa;
        }

        .card-links a {
            margin-right: 15px;
            font-size: 0.9rem;
            color: #6a11cb;
            transition: color 0.2s;
        }

        .card-links a:hover {
            color: #ff7e50;
        }

        /* Contact Section */
        #contact {
            padding: 80px 0;
            background-color: #121212;
        }

        #contact-form {
            max-width: 600px;
            margin: 0 auto;
            background: #1e1e1e;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #cccccc;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 5px;
            background-color: #2c2c2c;
            color: #e0e0e0;
            font-size: 1rem;
            transition: background-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            background-color: #3a3a3a;
            outline: none;
            box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.3);
        }

        textarea {
            resize: vertical;
            min-height: 120px;
        }

        .submit-button {
            background: linear-gradient(45deg, #ff7e50, #6a11cb);
            padding: 12px 25px;
            border: none;
            border-radius: 50px;
            color: white;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s, transform 0.3s;
            width: 100%;
        }

        .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(106, 17, 203, 0.4);
        }

        /* Footer */
        footer {
            background-color: #0a0a0a;
            color: #888;
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #222;
        }

        /* Animations Keyframes */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Adjustments */
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
                height: auto;
                padding: 10px 0;
            }
            .nav-links {
                margin-top: 15px;
            }
            .nav-links a {
                margin: 0 10px;
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
</head>
<body>

    <!-- Navigation Bar -->
    <header>
        <div class="container">
            <nav>
                <div class="logo">CodeCraft.dev</div>
                <div class="nav-links">
                    <a href="#hero">Home</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero">
        <div class="container hero-content">
            <h1>Crafting Digital Experiences with Code</h1>
            <p>A portfolio showcasing generative art, interactive web projects, and creative coding solutions.</p>
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
                    <img src="https://via.placeholder.com/400x200/333333/FFFFFF?text=Generative+Art" alt="Generative Art Project">
                    <div class="card-info">
                        <h3>Procedural Mandala</h3>
                        <p>An interactive visualizer using p5.js to create complex, symmetrical patterns.</p>
                        <div class="card-links">
                            <a href="#" target="_blank">Live Demo</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>
                <!-- Project Card 2 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x200/333333/FFFFFF?text=WebGL+Visualization" alt="WebGL Visualization Project">
                    <div class="card-info">
                        <h3>WebGL Data Flow</h3>
                        <p>Real-time visualization of network data using WebGL shaders for stunning performance.</p>
                        <div class="card-links">
                            <a href="#" target="_blank">Live Demo</a>
                            <a href="#" target="_blank">Code</a>
                        </div>
                    </div>
                </div>
                <!-- Project Card 3 -->
                <div class="project-card">
                    <img src="https://via.placeholder.com/400x200/333333/FFFFFF?text=Interactive+Web+Game" alt="Interactive Web Game Project">
                    <div class="card-info">
                        <h3>Particle Swarm Sim</h3>
                        <p>A fun physics-based simulation allowing user input to influence particle behavior.</p>
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
            <form id="contact-form" action="#" method="POST">
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
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 CodeCraft Portfolio. Built with Creativity and Code.</p>
        </div>
    </footer>

    <script>
        // Simple client-side handling for demonstration (No actual backend submission)
        document.getElementById('contact-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const submitButton = this.querySelector('.submit-button');
            submitButton.innerText = 'Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! I will get back to you shortly.');
                this.reset();
                submitButton.innerText = 'Send Message';
                submitButton.disabled = false;
            }, 1500);
        });
    </script>
</body>
</html>
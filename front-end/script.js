//message submission form
       //show form submission status
        const postStatus = status => {

            //get inputs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message')

            //get message screens
            const loadingMsg = document.getElementById('loadingMsg');
            const successMsg = document.getElementById('successMsg');
            const errorMsg = document.getElementById('errorMsg');
            const exitBtn = document.getElementById('exitBtn');

            //if success
            if (status === 'success') {
                loadingMsg.style.display = 'none';
                errorMsg.style.display = 'none';
                successMsg.style.display = 'flex';
                exitBtn.style.display = 'block';

                //clear inputs
                name.value = '';
                email.value = '';
                message.value = '';


            //if failed
            } else {
                loadingMsg.style.display = 'none';
                successMsg.style.display= 'none;'
                errorMsg.style.display = 'flex';
                exitBtn.style.display = 'block'
            }
        }

        //post data when sending a message
        const postMessage = async (name,email,message,token) => {
            const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    token: token
                })
            };

            try {
                const response = await fetch('https://mattallen.tech/api/send-message', settings);
                //const response = await fetch('http://localhost:8080/api/send-message', settings);
                const data = await response.json();
                if (response.status === 400) throw new Error(data.status)
                if (response.status === 200) postStatus('success');
                else postStatus('error');
            } catch(err) {
                console.log(err)
                postStatus('error');
            }
        }

        //toggle form overlay
        const exitBtn = document.getElementById('exitBtn');

        const toggleOverlay = () => {
            const overlay = document.getElementById('alertOverlay');

            if (overlay.style.display === 'flex') overlay.style.display = 'none';
            else overlay.style.display = 'flex';
        }

        //exit button event listener
        exitBtn.addEventListener('click', toggleOverlay);


        //handle form submit
        const handleSubmit = e => {
            //prevent default
            e.preventDefault();

            //show form overlay 
            toggleOverlay();
            
            //Google recaptcha
            grecaptcha.ready(function() {
                grecaptcha.execute('6LemCSsdAAAAAC_qoQ-3SlwpDyyY4ltgyfkq9SK3', {action: 'submit'}).then(function(token) {

                    //get inputs
                    const name = document.getElementById('name');
                    const email = document.getElementById('email');
                    const message = document.getElementById('message')

                    //post data
                    postMessage(name.value,email.value,message.value,token);

                });
            });

        }

        //add form event listener
        const form = document.getElementById('contact');
        form.addEventListener('submit',handleSubmit);



//toggle tools/tech/skills sections on click
        //toggle section
        const toggleSection = show => {
            //get DOM elements
            const toolsSection = document.getElementById('tools');
            const techSection = document.getElementById('tech');
            const skillsSection = document.getElementById('abilities');

            //assign section a value
            let section = null;

            if (show === 'tools') section = toolsSection;
            else if (show === 'tech') section = techSection;
            else section = skillsSection;

            //toggle style
            if (!section.style.maxHeight) {
                section.style.maxHeight = '500px';
                section.style.overlflow = 'visible';
                console.log('open')
            } else {
                console.log('closed')
                section.style.maxHeight = null;
                section.style.overflow = 'hidden';
            }
        }

        //get buttons
        const toolsBtn = document.getElementById('toolsBtn');
        const techBtn = document.getElementById('techBtn');
        const skillsBtn = document.getElementById('skillsBtn');

        //add event listeners
        toolsBtn.addEventListener('click', () => toggleSection('tools'));
        techBtn.addEventListener('click', () => toggleSection('tech'));
        skillsBtn.addEventListener('click', () => toggleSection('skills'));
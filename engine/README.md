# Inspiration

You get online to do your real analysis coursework, opening a new tab in Chrome to reach an online Latex compiler. But there's an ad! New AF1's for only 75 bucks? You click the ad and get redirected to Amazon, and before you know it, you fail real analysis, fail to get your degree, gamble away your money, and are very, very sad.

Filtra helps you blur those distractions on your browser. You finish your work on time, which leads to more learning, more productivity, and better grades.

# What it does

There is a focus mode and a relaxing mode. On relax mode, nothing is filtered. On focus mode, everything is filtered depending on whether or not it helps you become more productive or not.

# How we built it

We use proprietary LLM technology to decide what elements will help you become more productive or not. We have a NextJS Frontend and Flask backend that integrate seamlessly with OpenAI API in order to decide which HTML elements in the website DOM are necessary.

# Challenges we ran into

Querying all the elements of the DOM is relatively slow, and even slower is OpenAI API. It takes much time for OpenAI to decide which elements can be unfiltered. Thus, for each loaded website, one challenge is that it takes many seconds for the screen to load and the HTML elements to show up. One way to speed this up is to use faster ML technologies than LLMs in order to determine if an element is "productive" or not.

# Accomplishments that we're proud of

The technology works to filter elements out in the website, and the UI is clean and easy to use. It is very self-explanatory (see video link below). Once you have the application running, you can easily toggle between two modes, "focus" and "relax."

# What we learned

Transformer technology can be used for a wide variety of use cases, and LLMs can be used for things beyond NLP. In this case, the OpenAI API is able to process web elements in the form of HTML elements in our DOM, and filter out elements and divs that are deemed unproductive.

# What's next for Filtra

Speed, speed, speed...! The only issue that we are facing is speed of API responses, which causes some of the web pages to load and be processed very slowly. In the future, we plan to test out other ML models to see if we can achieve more speed and greater accuracy in determining which web elements are useless and can be filtered out.

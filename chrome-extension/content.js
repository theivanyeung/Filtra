{
    /**
     * Table of Content
     *
     * 1. Data
     * 2. Functions
     * 3. API
     * 4. Fetch Elements
     * 5. DOM Observer
     * 6. Initialization
     */
  }
  
  {
    /**
     * Data
     */
  }
  
  /**
   * This is the data structure:
   * {
   *  text: [{
   *    uid: uid
   *    element: Element
   *    content: string
   *  },
   *  ...]
   *  images: [{
   *    uid: uid
   *    element: Element
   *    content: string
   *  },
   *  ...]
   *  videos: [{
   *    uid: uid
   *    element: Element
   *    content: string
   *  },
   *  ...]
   *  clickableElements: [{
   *    uid: uid
   *    element: Element
   *    {textArr}
   *    {imagesArr}
   *    {videosArr}
   *  },
   *  ...]
   * }
   */
  
  const contentData = {
    text: [],
    images: [],
    videos: [],
    ads: [],
    clickableElements: [],
  };
  
  {
    /**
     * Functions
     */
  }
  
  /**
   * Generates random UID
   * @returns UID
   */
  const generateUID = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  // Inject SVG filter for blur
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.width = "0";
  svg.style.height = "0";
  svg.style.position = "absolute";
  const filter = document.createElementNS(svgNS, "filter");
  filter.id = "confined-blur";
  const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussianBlur.setAttribute("stdDeviation", "25"); // Adjust the blur level
  filter.appendChild(feGaussianBlur);
  svg.appendChild(filter);
  document.body.appendChild(svg);
  
  /**
   * Blurs elements
   * @param {Node} element
   */
  const blurElement = (element) => {
    element.style.filter = "url(#confined-blur)";
    // element.addEventListener("mouseover", () => {
    //   element.style.filter = "none";
    // });
    // element.addEventListener("mouseout", () => {
    //   element.style.filter = "url(#confined-blur)";
    // });
  };
  
  /**
   * Unblurs Element
   * @param {*} element
   */
  const unblurElement = (element) => {
    element.style.filter = "none";
  };
  
  /**
   * Makes an element unclickable
   * @param {Node} element
   */
  const neutralizeElement = (element) => {
    element.style.pointerEvents = "none";
  };
  
  /**
   * Makes an element clickable again
   * @param {Node} element
   */
  const unneutralizeElement = (element) => {
    element.style.pointerEvents = "auto";
  };
  
  /**
   * Helper function to check if an element or any of its ancestors has the "data-processed" attribute
   * @param {*} element
   * @returns
   */
  const isAncestorProcessed = (element) => {
    while (element) {
      if (element.getAttribute("data-processed") === "true") {
        return true;
      }
  
      element = element.parentElement;
    }
    return false;
  };
  
  {
    /**
     * Handle Elements
     */
  }
  
  const processContent = async (content) => {
    // Analyze Text
    while (content.text.length > 0) {
      await analyzeText(content.text[0].content, content.text[0].element);
      content.text.shift();
    }
  
    // Analyze Images
    while (content.images.length > 0) {
      await analyzeImage(content.images[0].content, content.images[0].element);
      content.images.shift();
    }
  
    // Analyze Videos
    // while (content.videos.length > 0) {
    //   await analyzeContent(
    //     content.videos[0].content,
    //     "video",
    //     content.videos[0].element
    //   );
    //   content.videos.shift();
    // }
  
    // Analyze Clickable Elements
    while (content.clickableElements.length > 0) {
      await analyzeClickable(
        content.clickableElements[0],
        content.clickableElements[0].element
      );
      content.clickableElements.shift();
    }
  };
  
  const SERVER_URL = "http://127.0.0.1:5000";
  
  // Handle Image Content
  const resolveImageContent = (content) => {
    if (content.startsWith("data:image/")) {
      const commaIndex = content.indexOf(",");
  
      if (commaIndex !== -1) {
        return { content: content.substring(commaIndex + 1), isbase: true };
      }
    }
  
    if (!content.startsWith("http")) {
      const baseUrl = window.location.origin;
      return new URL(content, baseUrl).href;
    }
  
    return content;
  };
  
  /**
   * Sends text to AI engine to be analyzed
   * @param {*} content
   * @param {*} element
   */
  const analyzeText = async (content, element) => {
    try {
      const response = await fetch(`${SERVER_URL}/engine/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
  
      if (data.response.toLowerCase().includes("false")) {
        unblurElement(element);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
  /**
   * Sends image to AI engine to be analyzed
   * @param {*} content
   * @param {*} element
   */
  const analyzeImage = async (content, element) => {
    try {
      content = resolveImageContent(content);
      let body;
  
      if (typeof content === "object" && content.isbase) {
        body = JSON.stringify(content);
      } else {
        body = JSON.stringify({ content, isbase: false });
      }
  
      const response = await fetch(`${SERVER_URL}/engine/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
  
      const data = await response.json();
      if (data.response.toLowerCase().includes("no")) {
        unblurElement(element);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
  /**
   * Sends clickable to AI engine to be analyzed
   * @param {*} content
   * @param {*} element
   */
  const analyzeClickable = async (content, element) => {
    let numDistraction = 0;
    let numElement = 0;
  
    // Analyze text
    while (content.textContent.length > 0) {
      try {
        const response = await fetch(`${SERVER_URL}/engine/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content.textContent[0].content }),
        });
        const data = await response.json();
        if (data.response.toLowerCase().includes("true")) {
          numDistraction++;
        }
  
        numElement++;
      } catch (error) {
        console.error("Error: ", error);
      }
  
      content.textContent.shift();
    }
  
    // Analyze image
    while (content.imagesContent.length > 0) {
      try {
        content = resolveImageContent(content.imagesContent[0].content);
        let body;
  
        if (typeof content === "object" && content.isbase) {
          body = JSON.stringify(content);
        } else {
          body = JSON.stringify({ content, isbase: false });
        }
  
        const response = await fetch(`${SERVER_URL}/engine/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });
  
        const data = await response.json();
        if (data.response.toLowerCase().includes("yes")) {
          numDistraction++;
        }
  
        numElement++;
      } catch (error) {
        console.error("Error: ", error);
      }
  
      content.imagesContent.shift();
    }
  
    // Analyze video
    // while (content.videosContent.length > 0) {
    //   try {
    //   } catch (error) {
    //     console.error("Error: ", error);
    //   }
    // }
  
    if (numDistraction <= numElement / 2) {
      unblurElement(element);
      unneutralizeElement(element);
    }
  };
  
  const analyzeShit = async (content) => {
    try {
      const response = await fetch(`${SERVER_URL}/engine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
  {
    /**
     * Fetch Elements
     */
  }
  
  {
    /** Get Clickable Element */
  }
  
  /**
   * Gets clickable elements
   * @param {*} node
   * @param {*} arr
   * @returns
   */
  const getClickableElement = (node, arr) => {
    const clickableSelectors = [
      "a",
      "button",
      "[onclick]",
      '[role="button"]',
      '[role="link"]',
    ];
  
    const clickableElements = node.querySelectorAll(clickableSelectors.join(","));
  
    const pointerElements = Array.from(node.querySelectorAll("*")).filter(
      (el) => {
        const style = window.getComputedStyle(el);
        return style.cursor === "pointer";
      }
    );
  
    const combinedElements = Array.from(
      new Set([...clickableElements, ...pointerElements])
    );
  
    const visibleClickableElements = combinedElements.filter((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    });
  
    visibleClickableElements.forEach((el) => {
      if (isAncestorProcessed(el)) return;
  
      const uid = generateUID();
  
      const clickableElementData = {
        uid,
        element: el,
        textContent: [],
        imagesContent: [],
        videosContent: [],
      };
  
      getTextNodes(el, clickableElementData.textContent);
      getImages(el, clickableElementData.imagesContent);
      getVideos(el, clickableElementData.videosContent);
  
      if (
        clickableElementData.textContent.length === 0 &&
        clickableElementData.imagesContent.length === 0 &&
        clickableElementData.videosContent.length === 0
      ) {
        return;
      }
  
      el.setAttribute("data-processed", "true");
  
      arr.push(clickableElementData);
  
      blurElement(el);
      neutralizeElement(el);
    });
  };
  
  {
    /** Get Text Element */
  }
  
  /**
   * Checks if the node contains text
   * @param {*} node
   * @returns
   */
  const isTextNode = (node) => {
    return node.nodeType === 3;
  };
  
  /**
   * Checks if the node has any non whitespaces
   * @param {*} node
   * @returns
   */
  const hasNonWhitespaceContent = (node) => {
    return /\S/.test(node.nodeValue);
  };
  
  /**
   * Get text
   * @param {*} node
   * @param {*} type
   * @param {*} arr
   * @returns
   */
  const getTextNodes = (node, arr) => {
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Check if the node is inside an irrelevant element.
          let isInsideStyleTag = false;
          let parent = node.parentElement;
          while (parent) {
            if (
              parent.tagName === "STYLE" ||
              parent.tagName === "SCRIPT" ||
              parent.tagName === "NOSCRIPT"
            ) {
              isInsideStyleTag = true;
              break;
            }
            parent = parent.parentElement;
          }
  
          // If the node is inside an irrelevant element, reject it.
          if (isInsideStyleTag) {
            return NodeFilter.FILTER_REJECT;
          }
  
          return isTextNode(node) && hasNonWhitespaceContent(node)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      },
      false
    );
  
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (!isAncestorProcessed(currentNode.parentElement)) {
        const uid = generateUID();
  
        arr.push({
          uid,
          element: currentNode.parentElement,
          content: currentNode.nodeValue,
        });
  
        blurElement(currentNode.parentElement);
      }
    }
  };
  
  {
    /** Get Images Element */
  }
  
  /**
   * Gets images
   * @param {*} node
   * @param {*} arr
   */
  const getImages = (node, arr) => {
    const images = node.querySelectorAll('img, [style*="background-image"]');
    images.forEach((imgElement) => {
      if (!isAncestorProcessed(imgElement)) {
        const uid = generateUID();
  
        arr.push({
          uid,
          element: imgElement,
          content: imgElement.getAttribute("src"),
        });
  
        blurElement(imgElement);
      }
    });
  };
  
  {
    /** Get Videos Element */
  }
  
  /**
   * Gets videos
   * @param {*} node
   * @param {*} arr
   */
  const getVideos = (node, arr) => {
    const videos = node.querySelectorAll("video, source, iframe, lima-video");
    videos.forEach((videoElement) => {
      if (isAncestorProcessed(videoElement)) {
        const uid = generateUID();
  
        arr.push({
          uid,
          element: videoElement,
          content:
            videoElement.getAttribute("poster") ||
            videoElement.getAttribute("src") ||
            videoElement.getAttribute("currentSrc"),
        });
  
        videoElement.setAttribute("muted", "");
  
        blurElement(videoElement);
      }
    });
  };
  
  {
    /** Get Google Ad Banners Element */
  }
  
  /**
   * Gets google ad banners
   * @param {*} node
   */
  const getGoogleAdBanners = (node) => {
    const googleAds = node.querySelectorAll(
      'iframe[src*="googlesyndication.com"], [src*="doubleclick.net"], ytd-video-masthead-ad-primary-video-renderer'
    );
  
    googleAds.forEach((adElement) => {
      blurElement(adElement);
    });
  
    const googleAdClassesOrIds = node.querySelectorAll(
      '[class*="ads"], [class*="google"], [id*="ads"], [id*="google"]'
    );
  
    googleAdClassesOrIds.forEach((adElement) => {
      blurElement(adElement);
    });
  };
  
  {
    /**
     * DOM Observer
     */
  }
  
  /**
   * Mutation observer
   */
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newNodeContent = {
              text: [],
              images: [],
              videos: [],
              clickableElements: [],
            };
  
            getClickableElement(node, newNodeContent.clickableElements);
            getTextNodes(node, newNodeContent.text);
            getImages(node, newNodeContent.images);
            getVideos(node, newNodeContent.videos);
            getGoogleAdBanners(node);
  
            if (
              newNodeContent.clickableElements.length !== 0 ||
              newNodeContent.text.length !== 0 ||
              newNodeContent.images.length !== 0 ||
              newNodeContent.videos.length !== 0
            ) {
              contentData.clickableElements =
                contentData.clickableElements.concat(
                  newNodeContent.clickableElements
                );
              contentData.text = contentData.text.concat(newNodeContent.text);
              contentData.images = contentData.images.concat(
                newNodeContent.images
              );
              contentData.videos = contentData.videos.concat(
                newNodeContent.videos
              );
  
              processContent(contentData);
              // analyzeShit(newNodeContent);
            }
          }
        });
      }
    });
  });
  
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "style"],
    characterData: false,
  });
  
  {
    /**
     * Initialization
     */
  }
  
  getClickableElement(document.body, contentData.clickableElements);
  getTextNodes(document.body, contentData.text);
  getImages(document.body, contentData.images);
  getVideos(document.body, contentData.videos);
  getGoogleAdBanners(document.body);
  processContent(contentData);
  // analyzeShit(contentData);
  
# Team Grass Final Report
### Team Members:
* Jenny Li 
* Daniel Chen

### Our Project: Character Customization Screen 🧍
  The Character Customization Screen project allows users to customize their character's physical features and background as well as control their character to walk around the space. There are various acessories, hairstyles, and clothing to experiment with 😁 🔧  
#### Customizing your Character 🧑👕👖🎤
You can click on different buttons to change your character and switch the background! Additionally, click on "Get a character!" to generate a random set of looks, accessories, and backgrounds! 

Here are a list of things you can change via the **control panel**: 
* Hair Style
* Skin Color
* Eye Style
* Mouth Style
* Top Clothing
* Bottom Clothing
* Items
* Background

Hint: Give you character all the items for a suprise 🎊🎁 Though please make sure that your volume isn't too loud 🔊

#### Moving your Character 🚶
Aside from just clicking the trigger buttons on the control panel, the recommended way to move the character is using a combination of the WASD and "Space" keys, while holding down "Shift" ⌨️
* **(Shift + W) Back:** press or hold to move backwards, into the screen. Your character wil be held in place if you're too far 🔼 
* **(Shift + S) Forward:** press or hold to move forwards, out of the screen. Your character wil be held in place if you're too close 🔽
* **(Shift + A) Left:** press or hold to move left. If you go too far, you will be teleported to the right-most portion of the screen ◀️
* **(Shift + D) Right:** press or hold to move right. If you go too far, you will be teleported to the left-most portion of the screen ▶️
* **(Shift + Space) Run:** hold and combine with other direction keys to move faster 🏃
* **(Shift + R) Reset:** pressing this will return your character to the starting position, facing forward 🔄

### Advanced Features:
**Shadows:**  

  
 ### References:
 * Disc 1B Week 9 Slides & Lecture: **smooth control and shadows**
 * Lecture Notes: general knowledge such as **textures, transformations, lighting, camera, materials**
 * Example Demos.js: reference for how to code more advanced features
---
---
# tiny-graphics.js

This is a small, single file JavaScript utility.  It organizes WebGL programs to be object-oriented and minimally cluttered.  

Writing code with raw JavaScript and WebGL can be repetitive and tedious.  Using frameworks like three.js can create an undesired separation between you and the raw JavaScript and WebGL and common graphics operations you want to learn.  Unlike other frameworks, tiny-graphics.js is purpose-built for education, has small source code, and teaches you how it is made.

This tiny library gives your WebGL program access to linear algebra routines, useful UI controls and readouts, and the drawing utilities needed by modern shader-based graphics.  It factors away the repetitive logic of GPU communication into re-usable objects.  The objects can be seamlessly shared between multiple WebGL contexts (drawing regions) on a web page.

The tiny-graphics.js software library has accompanied UCLA Computer Science's 174a course (Intro to Computer Graphics) since 2016, replacing Edward Angel's supplemental code from his textbook "Interactive Computer Graphics: A Top-Down Approach with WebGL".  Compared to Angel's library, tiny-graphics.js offers more organization and functionality.

This code library accompanies and supports a web project by the same author called "The Encyclopedia of Code", a crowd-sourced repository of WebGL demos and educational tutorials that uses an online editor.

To run a sample using tiny-graphics.js, visit its GitHub Pages link: https://encyclopedia-of-code.github.io/tiny-graphics-js/

To see all the demos and edit them:  Open the included "host.bat" or "host.command" file, then open localhost in your browser.  Open Developer Tools and create a workspace for your new folder.  Now you can edit the files, which is necessary to view the different demos.

To select a demo, open and edit main-scene.js.  Assign your choice to the Main_Scene variable.  Your choices for scenes are:

* Minimal_Webgl_Demo
* Transforms_Sandbox
* Axes_Viewer_Test_Scene
* Inertia_Demo
* Collision_Demo
* Many_Lights_Demo
* Obj_File_Demo
* Text_Demo
* Scene_To_Texture_Demo
* Surfaces_Demo

The code comments in each file should help, especially if you look at the definition of Transforms_Sandbox.  So should the explanations that the demos print on the page.  Enjoy!

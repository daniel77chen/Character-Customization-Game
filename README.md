# Team Grass Final Report
### Team Members:
* Jenny Li 
* Daniel Chen

## Our Project: Character Customization Screen 🧍
  The Character Customization Screen project allows users to customize their character's physical features and background as well as control their character to walk around the space. There are various acessories, hairstyles, and clothing to experiment with 😁 🔧  
### Customizing your Character 🧑👕👖🎤
You can click on different buttons to change your character and switch the background from a variety of choices! Additionally, click on "Get a character!" to generate a random set of looks, accessories, and backgrounds! 

<img width="828" alt="Screen Shot 2021-06-03 at 10 51 02 PM" src="https://user-images.githubusercontent.com/32944104/120752262-411a3900-c4be-11eb-8f8f-d8efdc95d8a3.png">

Here are a list of things you can change via the **control panel**: 
* Hair Style
* Skin Color
* Eye Style
* Mouth Style
* Clothing (Shirt)
* Clothing (Pants)
* Items/Accessories
* Background

#### Character Model 👦🏻
All of the parts and features used to create the character model were entirely built from primitive 3D shapes from examples/common.js. This includes a mix of spheres, cylinders, cone tips, torus, etc. to shape each of the details such as the hair fragments and facial features 👩‍🦳

In the default (non-moving) state, the character displays animations (i.e. swaying arms, bobbing head back and forth, eyes periodically blinking) as it is standing while the user hasn't provided any input to control its movements.

#### Accessories 💍
Some of the added accessories also offer unique additions to your character. For example: 
* Adding "Cat Ears" will show subtle animations as the cat ears sway along as the head bobs back and forth 🐱
* Selecting "Microphone" will prompt your character to sing a random song, which is also accompanied by extra animations for the mouth opening/closing and arm moving as it holds the mic. 🎤🎶 Beware: it likes singing a lot, so the only way you'll get it to stop is if you take its mic away by selecting "None" 🎤✋
 
**Hint:** Give your character all the accessories for a suprise 🎊🎁 Though please make sure that your volume isn't too loud 🔊

#### Backgrounds 🌳
Give your environment some character as well by choosing any one of the four backgrounds provided. Upon choosing a new background, it'll also be accompanied by its own ambient background noise and respective changes in environment lighting. 🎵

### Moving your Character 🚶
Aside from just clicking the trigger buttons on the control panel, the recommended way to move the character is using a combination of the WASD and "Space" keys, while holding down "Shift" ⌨️
* **(Shift + W) Back:** press or hold to move backwards, into the screen. Your character wil be held in place if you're too far 🔼 
* **(Shift + S) Forward:** press or hold to move forwards, out of the screen. Your character wil be held in place if you're too close 🔽
* **(Shift + A) Left:** press or hold to move left. If you go too far, you will be teleported to the right-most portion of the screen ◀️
* **(Shift + D) Right:** press or hold to move right. If you go too far, you will be teleported to the left-most portion of the screen ▶️
* **(Shift + Space) Run:** hold and combine with other direction keys to move faster 🏃
* **(Shift + R) Reset:** pressing this will return your character to the starting position, facing forward 🔄

### Advanced Features:
#### Shadows ❏
We chose to implement shadows for our advanced feature. To implement the shadows, I relied on the code provided by the TA (see References) for the Shadow Demo. To integrate it into our project we had to change our materials to use the Shadow_Textured_Phong_Shader and separate our code that renders the characters and environment into a separate function. This is because having shadows require the scene to be rendered twice -- a first pass to create a depth texture to obtain depth data for our objects from the point of view of a light, and a second pass to project this texture into the scene so that we can see the physical shadow.

In our project, you can view the shadows cast on the ground and on the character's body as the character moves in place, and the light source/shadows will also move along with the character as the user controls its movements. Note that the shadows appear more prominent during the two "daytime" backgrounds, while they are less visible in the darker backgrounds due to the dimming of the light source.
  
 ### References:
 * Disc 1B Week 9 Slides & Lecture: **smooth control and shadows**
 * Lecture Notes: general knowledge such as **textures, transformations, lighting, camera, materials**
 * Example Demos.js: reference for how to code more advanced features
 * TA's Shadow Demo: https://github.com/Robert-Lu/tiny-graphics-shadow_demo/blob/master/examples/shadow-demo.js#L182 
 * WebGL Shadows: https://webglfundamentals.org/webgl/lessons/webgl-shadows.html

### More Screenshots
<img width="807" alt="Screen Shot 2021-06-03 at 11 36 30 PM" src="https://user-images.githubusercontent.com/32944104/120756841-a113de00-c4c4-11eb-83e2-33bcf97c7bac.png">
<img width="808" alt="Screen Shot 2021-06-03 at 11 41 28 PM" src="https://user-images.githubusercontent.com/32944104/120757312-4333c600-c4c5-11eb-8810-e7a9f2a0eb06.png">
<img width="805" alt="Screen Shot 2021-06-03 at 11 40 11 PM" src="https://user-images.githubusercontent.com/32944104/120757475-72e2ce00-c4c5-11eb-8d77-a56a6939544c.png">
<img width="805" alt="Screen Shot 2021-06-03 at 11 43 27 PM" src="https://user-images.githubusercontent.com/32944104/120757529-81c98080-c4c5-11eb-94fc-219fa3f9be3f.png">
<img width="807" alt="Screen Shot 2021-06-03 at 11 46 15 PM" src="https://user-images.githubusercontent.com/32944104/120757905-01574f80-c4c6-11eb-863e-6feab1b5d830.png">
<img width="804" alt="Screen Shot 2021-06-03 at 11 49 12 PM" src="https://user-images.githubusercontent.com/32944104/120758140-52674380-c4c6-11eb-92a0-cc1b8ca344d4.png">


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

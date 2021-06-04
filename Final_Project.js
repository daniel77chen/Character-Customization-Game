import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

import {Color_Phong_Shader, Shadow_Textured_Phong_Shader,
    Depth_Texture_Shader_2D, Buffered_Texture, LIGHT_DEPTH_TEX_SIZE} from './examples/shadow-demo-shaders.js'

const HairStyles = Object.freeze({
    HORN: 0,
    EDGY: 1,
    TAIL: 2,
    BOWL: 3
});

const EyeStyle = Object.freeze({
    OPEN: 0,
    CLOSED: 1,
    ANIME: 2,
    CRY: 3
});

const MouthStyle = Object.freeze({
    OPEN: 0,
    CLOSED: 1,
    V: 2
});

const Backgrounds = Object.freeze({
    DAY: 0,
    NIGHT: 1,
    FUJI: 2,
    APOCALYPSE: 3
});

const Tops = Object.freeze({
   NONE: 0,
   SHIRT: 1,
   LONG: 2 
});

const Bottoms = Object.freeze({
    NONE: 0,
    SHORT: 1,
    LONG: 2,
    DUCK: 3
});

export class Final_Project extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.x_coord = this.y_coord = 0;
        this.direction_angle = 0;
        this.lower_clothing = this.upper_clothing = this.shoes = "";
        this.control = {};
        this.control.w = false;
        this.control.a = false;
        this.control.s = false;
        this.control.d = false;
        this.control.run = false;
        this.control.moving = false;
        this.upper_angle = this.lower_angle = 0.0;

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
               s: new defs.Subdivision_Sphere(4),
               s2: new defs.Subdivision_Sphere(4),
               cc: new defs.Capped_Cylinder(30,30),
               clc: new defs.Closed_Cone(15,15),
               cyt: new defs.Cylindrical_Tube(60,60,[[0, 1], [0, 1]]),
               t: new defs.Torus(50, 20),  // 1st param: how thicc donut is, 2nd: how jaggedy
               t2: new defs.Torus(3, 20),
               ct: new defs.Cone_Tip(2,4),
               r2d: new defs.Regular_2D_Polygon(15,15),
               rcc: new defs.Rounded_Closed_Cone(15,15,[[0,1], [0,1]]),
               circle: new defs.Regular_2D_Polygon(1, 15),
               moon: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(1),
               plane: new defs.Cube(),
               square: new defs.Square(),
               cube: new defs.Cube(),
               ground: new defs.Cube(),
               night: new defs.Cube(),

        };

        this.shapes.s2.arrays.texture_coord.forEach(
            (v,i,l) => l[i] = vec(1.5*v[0],1.5*v[1])
        );

        this.shapes.cc.arrays.texture_coord.forEach(
            (v,i,l) => l[i] = vec(.03*v[0],.03*v[1])
        );

        this.shapes.ground.arrays.texture_coord.forEach(
            (v,i,l) => l[i] = vec(12*v[0],12*v[1])
        );

        this.shapes.night.arrays.texture_coord.forEach(
            (v,i,l) => l[i] = vec(3*v[0],3*v[1])
        );

        this.stars = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(.5, .5, .5, 1),
            ambient: .4, diffusivity: .5, specularity: .5,
            color_texture: new Texture("assets/stars.png"),
            light_depth_texture: null
        });
        // For the first pass
        this.pure = new Material(new Color_Phong_Shader(), {});
        this.light_src = new Material(new defs.Phong_Shader(), {
            color: color(1, 1, 1, 1), ambient: 1, diffusivity: 0, specularity: 0
        });

        // *** Materials
        this.materials = {
                test: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .6, specularity: 1, color: hex_color("#edea47"),
                    color_texture: null,light_depth_texture: null
                    }),
                long_shirt: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .6, specularity: 1, color: hex_color("#faacac"),
                    color_texture: null,light_depth_texture: null
                    }),
                short_shirt: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .6, specularity: 1, color: hex_color("#e1e5ed"),
                    color_texture: null,light_depth_texture: null
                    }),
                long_pants: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .6, specularity: 1, color: hex_color("#4794ed"),
                    color_texture: null,light_depth_texture: null}),
                short_pants: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .6, specularity: 1, color: hex_color("#9c8481"),
                    color_texture: null,light_depth_texture: null}),
                hair: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .5, specularity: 0.3, color: hex_color("#755e48"),
                    color_texture: null,light_depth_texture: null}),
                eye: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: 0, specularity: 0, color: hex_color("#291515"),
                    color_texture: null,light_depth_texture: null}),
                belt_strap: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .6, specularity: 0, color: hex_color("#2f2f36"),
                    color_texture: null,light_depth_texture: null}),
                belt_buckle: new Material(new Shadow_Textured_Phong_Shader(1),
                    {ambient: .7, diffusivity: .6, specularity: 1, color: hex_color("#C0C0C0"),
                    color_texture: null,light_depth_texture: null}),

                grass: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: color(.25, .25, .25, 1), 
                    ambient: .4, diffusivity: .6, specularity: 0.1,
                    color_texture: new Texture("assets/grass-128.jpg"),
                    light_depth_texture: null
                }),
                grass_night: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: color(.25, .25, .25, 1), 
                    ambient: .2, diffusivity: .6, specularity: 0.1,
                    color_texture: new Texture("assets/grass-128.jpg"),
                    light_depth_texture: null
                }),
                sky: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    color_texture: new Texture("assets/sky-128.png"),
                    light_depth_texture: null
                }),
                night: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    color_texture: new Texture("assets/night-512.jpg"),
                    light_depth_texture: null
                }),
                rock: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: color(.25, .25, .25, 1), 
                    ambient: .4, diffusivity: .6, specularity: 0.2,
                    color_texture: new Texture("assets/rock2.jpg"),
                    light_depth_texture: null
                }),
                mountain: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    color_texture: new Texture("assets/mountain-512.jpg"),
                    light_depth_texture: null
                }),
                rock2: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: color(.15, .15, .15, 1), 
                    ambient: .2, diffusivity: .6, specularity: 0.5,
                    color_texture: new Texture("assets/rock3.jpg"),
                    light_depth_texture: null
                }),
                hellscape: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    color_texture: new Texture("assets/fire.jpg"),
                    light_depth_texture: null
                }),
                mic: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: color(.5, .5, .5, 1), 
                    ambient: .5, diffusivity: 0.9, specularity: 0.1,
                    color_texture: new Texture("assets/mic.jpg"),
                    light_depth_texture: null
                }),
                duck: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: color(.5, .5, .5, 1), 
                    ambient: .5, diffusivity: 0.9, specularity: 1,
                    color_texture: new Texture("assets/duck.jpg"),
                    light_depth_texture: null
                }),
                boxers: new Material(new Shadow_Textured_Phong_Shader(1), {
                    color: color(.5, .5, .5, 1), 
                    ambient: .5, diffusivity: 0.9, specularity: 1,
                    color_texture: new Texture("assets/boxers.jpg"),
                    light_depth_texture: null
                })
        }

        this.init_ok = false; // texture
        this.light_position = vec4(0, 10, 0, 1);
        this.light_color = color(1,1,1,1);

// not sure if we need this since im not using it rn 
        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 20), vec3(0, .5, 0), vec3(0, 1, 0));
        this.skin_color = hex_color("#f5d990");
        this.hair_color = hex_color("#755e48");
        this.top_style = Tops.LONG;
        this.bottom_style = Bottoms.LONG;
        this.hair_style = HairStyles.HORN;
        this.eye_style = EyeStyle.OPEN;
        this.mouth_style = MouthStyle.CLOSED;
        this.is_dark = this.cry = this.has_mic = this.has_cat = this.has_duck = this.has_belt = false;
        this.stage = Backgrounds.DAY;
        this.bgm = new Audio("assets/bg_day.mp3");
        this.bgm.loop = true;

        this.music = new Audio("assets/bubblegum.mp3");
        this.music.loop = true;
    }

    texture_buffer_init(gl) {
        // Depth Texture
        this.lightDepthTexture = gl.createTexture();
        // Bind it to TinyGraphics
        this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);
        this.materials.test.light_depth_texture = this.light_depth_texture;
        this.materials.long_shirt.light_depth_texture = this.light_depth_texture;
        this.materials.short_shirt.light_depth_texture = this.light_depth_texture;
        this.materials.long_pants.light_depth_texture = this.light_depth_texture;
        this.materials.short_pants.light_depth_texture = this.light_depth_texture;
        this.materials.belt_strap.light_depth_texture = this.light_depth_texture;
        this.materials.belt_buckle.light_depth_texture = this.light_depth_texture;
        this.materials.boxers.light_depth_texture = this.light_depth_texture;
        this.materials.hair.light_depth_texture = this.light_depth_texture;
        this.materials.eye.light_depth_texture = this.light_depth_texture;
        this.materials.grass.light_depth_texture = this.light_depth_texture;
        this.materials.grass_night.light_depth_texture = this.light_depth_texture;
        this.materials.sky.light_depth_texture = this.light_depth_texture;
        this.materials.night.light_depth_texture = this.light_depth_texture;
        this.materials.rock.light_depth_texture = this.light_depth_texture;
        this.materials.rock2.light_depth_texture = this.light_depth_texture;
        this.materials.mountain.light_depth_texture = this.light_depth_texture;
        this.materials.hellscape.light_depth_texture = this.light_depth_texture;

        this.lightDepthTextureSize = LIGHT_DEPTH_TEX_SIZE;
        gl.bindTexture(gl.TEXTURE_2D, this.lightDepthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,      // target
            0,                  // mip level
            gl.DEPTH_COMPONENT, // internal format
            this.lightDepthTextureSize,   // width
            this.lightDepthTextureSize,   // height
            0,                  // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT,    // type
            null);              // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Depth Texture Buffer
        this.lightDepthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,       // target
            gl.DEPTH_ATTACHMENT,  // attachment point
            gl.TEXTURE_2D,        // texture target
            this.lightDepthTexture,         // texture
            0);                   // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // create a color texture of the same size as the depth texture
        // see article why this is needed_
        this.unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.unusedTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.lightDepthTextureSize,
            this.lightDepthTextureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // attach it to the framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,        // target
            gl.COLOR_ATTACHMENT0,  // attachment point
            gl.TEXTURE_2D,         // texture target
            this.unusedTexture,         // texture
            0);                    // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    set_bgm(bg) {
        this.bgm.pause();
        switch (bg) {
            case Backgrounds.DAY:
                this.bgm = new Audio("assets/bg_day.mp3");     
                break;
            case Backgrounds.NIGHT:
                this.bgm = new Audio("assets/bg_night.mp3");
                break;
            case Backgrounds.FUJI:
                this.bgm = new Audio("assets/bg_fuji.mp3");
                break;
            default:
                this.bgm = new Audio("assets/bg_fire.mp3");                
        }
        this.bgm.loop = true;
        this.bgm.play();
    }

    set_random_song() {
        if (this.do_play_metal()) {
            this.set_metal_song();
        }
        else {
            this.music.pause();
            let songs = ["assets/bubblegum.mp3", "assets/september.mp3", "assets/badguy.mp3", "assets/giorno.mp3"];
            let rand_song = songs[Math.floor(Math.random() * songs.length)];
            this.music = new Audio(rand_song);
            this.music.loop = true;
        }
    }

    set_metal_song() {
        this.music.pause();
        this.music = new Audio("assets/metal1.mp3");
        this.music.loop = true;
    }

    do_play_metal() {
        return this.has_cat && this.has_mic && this.has_duck && this.has_belt; 
    }

    move_camera_left() {
        let desired = this.attached;
        desired = desired.times(Mat4.translation(CAMERA_X,0,-CAMERA_Z));
        this.attached = desired;
    }

    move_camera_right() {
        let desired = this.attached;
        desired = desired.times(Mat4.translation(-CAMERA_X,0,CAMERA_Z));
        this.attached = desired;
    }

    set_skin_color(col) {
        this.skin_color = hex_color(col);
    }

    set_hair_color(col) {
        this.hair_color = hex_color(col);
    }

    set_hair(hs) {
        this.hair_style = hs;
    }
    
    set_direction_angle() {
        let w = this.control.w; let s = this.control.s; let a = this.control.a; let d = this.control.d;
        if (!w && !s && !a && !d) this.control.moving = false;
        else this.control.moving = true; 
        if (w) {
            if(a) this.direction_angle = 225; 
            else if(d) this.direction_angle = 135;
            else this.direction_angle = 180;
        }
        else if(s){
            if(a) this.direction_angle = 315;
            else if(d) this.direction_angle = 45;
            else this.direction_angle = 0;
        }
        else if(a) this.direction_angle = 270;
        else if(d) this.direction_angle = 90;
        else this.direction_angle = this.direction_angle;
    }

    randomize() {
        let top_styles = [Tops.SHIRT, Tops.LONG];
        let bottom_styles = [Bottoms.SHORT, Bottoms.LONG, Bottoms.DUCK];
        let hair_styles = [HairStyles.HORN, HairStyles.EDGY, HairStyles.TAIL, HairStyles.BOWL];
        let hair_colors = ["#755e48", "#cc9e3b", "#231c38", "#eb8df0"];
        let skin_colors = ["#f5d990", "#ffb885", "#5e302a", "#3d3d8f", "#fffb00"];
        let eye_styles = [EyeStyle.OPEN, EyeStyle.CLOSED, EyeStyle.ANIME, EyeStyle.CRY];
        let mouth_styles = [MouthStyle.CLOSED, MouthStyle.OPEN, MouthStyle.V];
        let bgs = [Backgrounds.DAY, Backgrounds.NIGHT, Backgrounds.FUJI, Backgrounds.APOCALYPSE];
        let acc = ["none", "cat", "duck", "belt"];
        this.set_hair(hair_styles[Math.floor(Math.random() * hair_styles.length)]);
        this.set_hair_color(hair_colors[Math.floor(Math.random() * hair_colors.length)]);
        this.set_skin_color(skin_colors[Math.floor(Math.random() * skin_colors.length)]);
        let rand_eye = eye_styles[Math.floor(Math.random() * eye_styles.length)];
        this.eye_style = rand_eye;
        if (rand_eye == EyeStyle.CRY) {this.cry = true;} else {this.cry = false;}
        this.mouth_style = mouth_styles[Math.floor(Math.random() * mouth_styles.length)];
        this.top_style = top_styles[Math.floor(Math.random() * top_styles.length)];
        this.bottom_style = bottom_styles[Math.floor(Math.random() * bottom_styles.length)];
        let rand_bg = bgs[Math.floor(Math.random() * bgs.length)];
        this.stage = rand_bg;
        if (rand_bg == Backgrounds.DAY || rand_bg == Backgrounds.FUJI) {this.is_dark = false;} else {this.is_dark = true;}
        let rand_acc = acc[Math.floor(Math.random() * acc.length)];
        if (rand_acc === "cat") {
            this.has_cat = true;
            this.has_duck = this.has_mic = this.has_belt = false;
        }
        else if (rand_acc === "duck") {
            this.has_duck = true;
            this.has_cat = this.has_mic = this.has_belt = false;
        }
        else if (rand_acc === "belt") {
            this.has_belt = true;
            this.has_cat = this.has_mic = this.has_duck = false;   
        }
        else { this.has_duck = this.has_mic = this.has_cat = this.has_belt = false;}
        this.music.pause();
        this.set_bgm(rand_bg);
    }

    make_control_panel() {
        this.control_panel.innerHTML += "------------------------------------ Movement Controls ------------------------------------";
        this.new_line();
        this.key_triggered_button("Back", ["Shift","W"], 
            () => { this.control.w = true; this.control.s = false; this.set_direction_angle(); }, '#e6b93e',
            () => { this.control.w = false; this.set_direction_angle(); }); 
        this.key_triggered_button("Left",      ["Shift","A"],  
            () => { this.control.a = true; this.control.d = false; this.set_direction_angle(); }, '#e6b93e',
            () => { this.control.a = false; this.set_direction_angle(); }); 
        this.key_triggered_button("Forward",   ["Shift","S"],
            () => { this.control.s = true; this.control.w = false; this.set_direction_angle(); }, '#e6b93e',
            () => { this.control.s = false; this.set_direction_angle(); });  
        this.key_triggered_button("Right",     ["Shift","D"],
            () => { this.control.d = true; this.control.a = false; this.set_direction_angle(); }, '#e6b93e',
            () => { this.control.d = false; this.set_direction_angle(); }); 
        this.key_triggered_button("Speed Up",     ["Shift"," "],
            () => this.control.run = true , '#e6b93e', () => this.control.run = false); 
        this.key_triggered_button("Reset Location",     ["Shift","R"], 
            () => this.x_coord = this.y_coord = this.direction_angle = 0, '#e6b93e');
        
        this.new_line();
        this.live_string(box => {
            box.textContent = "----------------------------------- Customize Character -----------------------------------| Randomize |"
        });
        this.key_triggered_button("Give me a character!", ["?"], () => {this.randomize();});
        this.new_line();
        this.live_string(box => {box.textContent = "----- Head and Body"});
        this.new_line();
        this.live_string(box => {box.textContent = "Hair Color |"});
        this.key_triggered_button("Default", ["H"], () => {this.set_hair(HairStyles.HORN)});
        this.key_triggered_button("Edgy", ["H"], () => {this.set_hair(HairStyles.EDGY)});
        this.key_triggered_button("Ponytail", ["H"], () => {this.set_hair(HairStyles.TAIL)});
        this.key_triggered_button("Bowl", ["H"], () => {this.set_hair(HairStyles.BOWL)});
        this.live_string(box => {box.textContent = "| Hair Style |"});

        this.key_triggered_button("Brown", ["H"], () => {this.set_hair_color("#755e48")});
        this.key_triggered_button("Yellow", ["H"], () => {this.set_hair_color("#cc9e3b")});
        this.key_triggered_button("Dark", ["H"], () => {this.set_hair_color("#231c38")});
        this.key_triggered_button("Pink", ["H"], () => {this.set_hair_color("#eb8df0")});
        this.new_line();

        this.live_string(box => {box.textContent = "Eye Style |"});
        this.key_triggered_button("Normal", ["Eye"], () => {this.eye_style = EyeStyle.OPEN; this.cry = false;});
        this.key_triggered_button("Closed", ["Eye"], () => {this.eye_style = EyeStyle.CLOSED; this.cry = false;});
        this.key_triggered_button("Anime", ["Eye"], () => {this.eye_style = EyeStyle.ANIME; this.cry = false;});
        this.key_triggered_button("Cry", ["Eye"], () => {this.eye_style = EyeStyle.CRY; this.cry = true;});
        this.live_string(box => {box.textContent = "| Mouth Style |"});
        this.key_triggered_button(":|", ["Mouth"], () => {this.mouth_style = MouthStyle.CLOSED});
        this.key_triggered_button(":>", ["Mouth"], () => {this.mouth_style = MouthStyle.V});
        this.key_triggered_button(":o", ["Mouth"], () => {this.mouth_style = MouthStyle.OPEN});
        this.new_line();

        this.live_string(box => {box.textContent = "Skin Color |"});
        this.key_triggered_button("Default", ["Skin"], () => {this.set_skin_color("#f5d990")});
        this.key_triggered_button("Sunburnt", ["Skin"], () => {this.set_skin_color("#ffb885")});
        this.key_triggered_button("Banana", ["Skin"], () => {this.set_skin_color("#edea47")});
        this.key_triggered_button("Brown", ["Skin"], () => {this.set_skin_color("#5e302a")});
        this.key_triggered_button("Blue", ["Skin"], () => {this.set_skin_color("#3d3d8f")});
        this.new_line();
        this.live_string(box => {box.textContent = "----- Other"});
        this.new_line();
        this.live_string(box => {box.textContent = "Clothing | Shirt |"});
        this.key_triggered_button("Longsleeve", ["Top"], () => {this.top_style = Tops.LONG});
        this.key_triggered_button("T-shirt",    ["Top"], () => {this.top_style = Tops.SHIRT});
        this.key_triggered_button("None",       ["Top"], () => {this.top_style = Tops.NONE});
        this.live_string(box => {box.textContent = "| Pants |"});
        this.key_triggered_button("Jeans",  ["Bot"], () => {this.bottom_style = Bottoms.LONG});
        this.key_triggered_button("Shorts", ["Bot"], () => {this.bottom_style = Bottoms.SHORT});
        this.key_triggered_button("Duck", ["Bot"], () => {this.bottom_style = Bottoms.DUCK});
        this.key_triggered_button("None",   ["Bot"], () => {this.bottom_style = Bottoms.NONE});
        this.new_line();
        this.live_string(box => {box.textContent = "Accessories |"});
        this.key_triggered_button("None", ["Item"], () => {this.has_mic = false; this.has_cat = false; this.has_duck = false; this.has_belt = false; this.music.pause(); this.bgm.pause(); this.bgm.play();});
        this.key_triggered_button("Microphone", ["Item"], () => {
                this.has_mic = true;
                this.set_random_song();
                this.bgm.pause();
                this.music.play();
            });
        this.key_triggered_button("Cat Ears", ["Item"], () => {
                this.has_cat = true;
                if (this.do_play_metal()) {
                    this.set_metal_song();
                    this.bgm.pause();
                    this.music.play();
                }
            });
        this.key_triggered_button("Belt", ["Item"], () => { 
                this.has_belt = true; 
                if (this.do_play_metal()) {
                    this.set_metal_song();
                    this.bgm.pause();
                    this.music.play();
                }
            });
        this.key_triggered_button("Duck", ["Item"], () => {
                this.has_duck = true;
                if (this.do_play_metal()) {
                    this.set_metal_song();
                    this.bgm.pause();
                    this.music.play();
                }
            });

        this.new_line();
        this.live_string(box => {box.textContent = "Background |"});
        this.key_triggered_button("Day", ["Stage"], () => {this.stage = Backgrounds.DAY; this.is_dark = false; this.set_bgm(Backgrounds.DAY);});
        this.key_triggered_button("Scenic", ["Stage"], () => {this.stage = Backgrounds.FUJI; this.is_dark = false; this.set_bgm(Backgrounds.FUJI);});
        this.key_triggered_button("Night", ["Stage"], () => {this.stage = Backgrounds.NIGHT; this.is_dark = true; this.set_bgm(Backgrounds.NIGHT);});
        this.key_triggered_button("Apocalypse", ["Stage"], () => {this.stage = Backgrounds.APOCALYPSE; this.is_dark = true; this.set_bgm(Backgrounds.APOCALYPSE);});
    }


    draw_leg(context, program_state, model_transform, shadow_pass, t, skin_material, pant_material, r) {
        if (this.control.moving) {
            if (this.control.run) this.upper_angle = Math.sin(100*t)*0.5;
            else this.upper_angle = Math.sin(5*t)*0.5;
        }
        else this.upper_angle = 0;
        let feet = model_transform
        if (r) {
            feet = feet.times(Mat4.rotation(this.upper_angle,1,0,0)).times(Mat4.translation(0,0,-3.65)).times(Mat4.scale(0.5,0.5,0.5));
            model_transform = model_transform
                            .times(Mat4.rotation(this.upper_angle,1,0,0))
                            .times(Mat4.scale(0.35,0.35,1.2))
                            .times(Mat4.translation(0,0,-(0.5+0.5)))
                            ; }
        else {
            feet = feet.times(Mat4.rotation(-this.upper_angle,1,0,0)).times(Mat4.translation(0,0,-3.65)).times(Mat4.scale(0.5,0.5,0.5));
            model_transform = model_transform
                            .times(Mat4.rotation(-this.upper_angle,1,0,0))
                            .times(Mat4.scale(0.35,0.35,1.2))
                            .times(Mat4.translation(0,0,-(0.5+0.5)))
                            ;}
        this.shapes.cc.draw(context, program_state, model_transform, !shadow_pass? this.pure : pant_material); //thigh
        model_transform = model_transform
                            .times(Mat4.scale(0.9,0.9,1.2))
                            .times(Mat4.translation(0,0,-0.9))
                            ;
        if (this.bottom_style == Bottoms.SHORT || this.bottom_style == Bottoms.DUCK) this.shapes.cc.draw(context, program_state, model_transform, !shadow_pass? this.pure : skin_material); //calf
        else this.shapes.cc.draw(context, program_state, model_transform, !shadow_pass? this.pure : pant_material); //calf
        
        this.shapes.s.draw(context, program_state, feet, !shadow_pass? this.pure : skin_material); //feet
        if (this.has_duck) {
        let duck_body = skin_material.override({color:hex_color("#f5c751")}); 
        this.shapes.t.draw(context, program_state, feet
            .times(Mat4.scale(2,2,3))
            , !shadow_pass? this.pure : duck_body);
        this.shapes.s.draw(context, program_state, feet
            .times(Mat4.translation(0,-2,0.9))
            .times(Mat4.rotation(-Math.PI/2,0,1,0))
            .times(Mat4.rotation(-Math.PI/2,0,0,1))
            , !shadow_pass? this.pure : this.darken_maybe(this.materials.duck, .2));       
        }
        return model_transform;
    }

    draw_arm(context, program_state, model_transform, shadow_pass, t, skin_material, shirt_material){
        let hand_transform = model_transform
                                .times(Mat4.scale(0.5,0.5,0.5))
                                .times(Mat4.translation(0,0,-2))
                                ;
        let upper_arm_transform = model_transform.times(Mat4.scale(0.35,0.35,1.2)).times(Mat4.translation(0,0,1.2));
        this.shapes.cc.draw(context, program_state, upper_arm_transform, !shadow_pass? this.pure : shirt_material);

        let lower_arm_transform = model_transform.times(Mat4.scale(0.3,0.3,1.5)).times(Mat4.translation(0,0,0.1));
        if(this.top_style == Tops.SHIRT) this.shapes.cc.draw(context, program_state, lower_arm_transform, !shadow_pass? this.pure : skin_material);        
        else this.shapes.cc.draw(context, program_state, lower_arm_transform, !shadow_pass? this.pure : shirt_material);        
        
        this.shapes.s.draw(context, program_state, hand_transform, !shadow_pass? this.pure : skin_material);
        return model_transform;
    }

    draw_mic_arm(context, program_state, model_transform, shadow_pass, t, skin_material, shirt_material){
let hand_transform = model_transform
                                .times(Mat4.scale(0.5,0.5,0.5))
                                .times(Mat4.translation(0,0,-2))
                                ;
        let upper_arm_transform = model_transform.times(Mat4.scale(0.35,0.35,1.2)).times(Mat4.translation(0,0,1.2));
        this.shapes.cc.draw(context, program_state, upper_arm_transform, !shadow_pass? this.pure : shirt_material);

        let lower_arm_transform = model_transform.times(Mat4.scale(0.3,0.3,1.5)).times(Mat4.translation(0,0,0.1));
        if(this.top_style == Tops.SHIRT) this.shapes.cc.draw(context, program_state, lower_arm_transform, !shadow_pass? this.pure : skin_material);        
        else this.shapes.cc.draw(context, program_state, lower_arm_transform, !shadow_pass? this.pure : shirt_material);        
        
        this.shapes.s.draw(context, program_state, hand_transform, !shadow_pass? this.pure : skin_material);

        let mic_body = skin_material.override({color:hex_color("#292929")}); 
        this.shapes.cc.draw(context,program_state,
            hand_transform
            .times(Mat4.rotation(Math.PI/4,0,0,1))
            .times(Mat4.rotation(Math.PI/3,1,0,0))
            .times(Mat4.translation(0,0,.4))
            .times(Mat4.scale(.5,.5,3.5))
            ,!shadow_pass? this.pure : mic_body);
       this.shapes.s.draw(context,program_state,
            hand_transform
            .times(Mat4.rotation(-3*Math.PI/4,0,0,1))
            .times(Mat4.rotation(-4*Math.PI/3,1,0,0))
            .times(Mat4.translation(0,0,-2.5))
            .times(Mat4.scale(.8,.8,.8))
            ,!shadow_pass? this.pure : this.darken_maybe(this.materials.mic, .2));
        return model_transform;
    }
    
    draw_belt(context, program_state, model_transform, shadow_pass, strap_material, buckle_material) {
        let strap_transform = model_transform.times(Mat4.scale(1.05,1.05,0.2)).times(Mat4.translation(0,0,-5));
        this.shapes.cc.draw(context, program_state, strap_transform, !shadow_pass? this.pure : strap_material) //strap
        let buckle_transform = model_transform.times(Mat4.scale(.3,0.1,0.2)).times(Mat4.translation(0,-10,-5));
        this.shapes.cube.draw(context, program_state, buckle_transform, !shadow_pass? this.pure : buckle_material) //buckle
    }
    
    set_location(dt) {
        let mult_var = 0.73;
        let max_x = 18.0; let min_x = -18.0; let max_y = 10.0; let min_y = -80.0;
        let speed = 4.0 + (max_y - this.y_coord)/8;
        if(this.control.run) speed += 6.0;
        if(this.control.w) {
            this.y_coord -= dt*speed;
            if(this.y_coord < min_y) this.y_coord = min_y;
        }
        if(this.control.s) {
            this.y_coord += dt*speed;
            if(this.y_coord > max_y) this.y_coord = max_y;
            if(this.x_coord > ((max_x-this.y_coord)/mult_var)) this.x_coord = ((max_x-this.y_coord)/mult_var);
            if(this.x_coord < ((min_x+this.y_coord)/mult_var)) this.x_coord = ((min_x+this.y_coord)/mult_var);
        }
        if(this.control.a) {
            this.x_coord -= dt*speed;
            if(this.x_coord < (min_x+this.y_coord*mult_var)) this.x_coord = (max_x-this.y_coord*mult_var);
        }
        if(this.control.d) {
            this.x_coord += dt*speed;
            if(this.x_coord > (max_x-this.y_coord*mult_var)) this.x_coord = (min_x+this.y_coord*mult_var);
        }
    }

    move_character(model_transform, dt) {
        model_transform = model_transform
            .times(Mat4.translation(this.x_coord, 0, this.y_coord))
            .times(Mat4.rotation(this.direction_angle*Math.PI/180,0,1,0));
        return model_transform
    }

    darken_maybe(material, factor = .3) {
        return this.is_dark ? material.override({ambient: factor}) : material;
    }

    render_scene(context, program_state, shadow_pass, draw_light_source=false, draw_shadow=false) {
        // shadow_pass: true if this is the second pass that draw the shadow.
        // draw_light_source: true if we want to draw the light source.
        // draw_shadow: true if we want to draw the shadow

        let light_position = this.light_position;
        let light_color = this.light_color;
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        program_state.draw_shadow = draw_shadow;
        const BLINK_PERIOD = 5;
        const blink_t = t % BLINK_PERIOD;
        let eye_state = this.eye_style;
        if (this.do_play_metal() && blink_t >= BLINK_PERIOD/2) {
            eye_state = EyeStyle.CLOSED;
        }
        else if (blink_t >= BLINK_PERIOD -1) {
            eye_state = EyeStyle.CLOSED;
        }

        let MOUTH_PERIOD = this.do_play_metal() ? .25 : .5;
        const mouth_t = t % MOUTH_PERIOD;
        let mouth_state = this.mouth_style;
        if (this.has_mic) {
            mouth_state = MouthStyle.CLOSED;
            if (mouth_t >= MOUTH_PERIOD/2) {
                mouth_state = MouthStyle.OPEN;
            }
        }

        // background
        let ident = Mat4.identity();
        let skin_material = this.darken_maybe(this.materials.test.override({color:this.skin_color}));
        if (this.stage == Backgrounds.NIGHT) {
            this.shapes.ground.draw(context, program_state, ident.times(Mat4.translation(0,-5,0)
                .times(Mat4.scale(100,.001,100))), !shadow_pass? this.pure : this.materials.grass_night);

            this.shapes.night.draw(context, program_state, ident.times(Mat4.translation(0,0,-200)
                .times(Mat4.scale(200,150,.001))), !shadow_pass? this.pure : this.materials.night);
        }
        else {
            let ground_material = this.stage == Backgrounds.APOCALYPSE ? this.materials.rock2 : (this.stage == Backgrounds.DAY ? this.materials.grass : this.materials.rock);
            let sky_material = this.stage == Backgrounds.APOCALYPSE ? this.materials.hellscape : (this.stage == Backgrounds.DAY ? this.materials.sky : this.materials.mountain);
            this.shapes.ground.draw(context, program_state, ident.times(Mat4.translation(0,-5,0)
                .times(Mat4.scale(100,.001,100))), !shadow_pass? this.pure : ground_material);

            this.shapes.plane.draw(context, program_state, ident.times(Mat4.translation(0,10,-200)
                .times(Mat4.scale(200,150,.001))), !shadow_pass? this.pure : sky_material);
        }

        let location_transform = this.location_transform;
        let body_transform = location_transform.times(Mat4.rotation(-Math.PI/2,1,0,0));
        let belt_transform = body_transform;
        let head_transform = Mat4.identity();
        let head_radius = 2.3;
        let arm_angle = Math.sin(2*t)/2;
        let mic_arm_angle = 1.5 + Math.sin(2*t)/3;
        let head_angle = Math.sin(2*t)/16;
        if (this.do_play_metal()) {
            head_angle = Math.sin(35*t)/8;
            arm_angle = Math.sin(35*t)/2;
            mic_arm_angle = 1.5 + Math.sin(35*t)/3;
        }
        else if (this.has_mic) {
            head_angle = Math.sin(4*t)/16;
            mic_arm_angle = 1.5 + Math.sin(4*t)/3;
        }
        let r_arm_transform = body_transform
                            .times(Mat4.translation(1.9,0,0))
                            .times(Mat4.translation(-1.25,0,1.5))
                            .times(Mat4.rotation(arm_angle,1,0,0))
                            .times(Mat4.translation(1.25,0,-1.5))
                            .times(Mat4.rotation(-0.7,0,1,0));
        let l_arm_transform = body_transform
                            .times(Mat4.translation(-1.9,0,0))
                            .times(Mat4.translation(-1.25,0,1.5))
                            .times(Mat4.rotation(this.has_mic ? -mic_arm_angle : -arm_angle,1,0,0))
                            .times(Mat4.translation(1.25,0,-1.5))
                            .times(Mat4.rotation(0.7,0,1,0));

        //body & legs
        let shirt_material = this.darken_maybe(this.materials.long_shirt); //LONG
        if(this.top_style == Tops.NONE) shirt_material = skin_material; //NONE
        else if(this.top_style == Tops.SHIRT) shirt_material = this.darken_maybe(this.materials.short_shirt); //SHIRT
        let pant_material = this.darken_maybe(this.materials.long_pants); //LONG_PANTS
        if(this.bottom_style == Bottoms.NONE) pant_material = skin_material; //NONE
        else if(this.bottom_style == Bottoms.SHORT) pant_material = this.darken_maybe(this.materials.short_pants); //SHORT_PANTS
        else if(this.bottom_style == Bottoms.DUCK) pant_material = this.darken_maybe(this.materials.boxers, .2);
        
        this.shapes.cc.draw(context, program_state, body_transform.times(Mat4.scale(1,1,2)), !shadow_pass? this.pure : shirt_material); //body
        body_transform = body_transform.times(Mat4.translation(0,0,1));
        this.shapes.s.draw(context, program_state, body_transform.times(Mat4.scale(1,1,1)), !shadow_pass? this.pure : shirt_material); //shoulders
        body_transform = body_transform.times(Mat4.translation(0,0,-2));
        this.shapes.s2.draw(context, program_state, body_transform.times(Mat4.scale(1,1,1)), !shadow_pass? this.pure : pant_material); //bottom torso
        
        if(this.has_belt) 
            this.draw_belt(context, program_state, belt_transform, shadow_pass, this.darken_maybe(this.materials.belt_strap), this.darken_maybe(this.materials.belt_buckle)); //belt

        let l_leg_transform = body_transform.times(Mat4.translation(-0.5,0,0));
        this.draw_leg(context, program_state, l_leg_transform, shadow_pass, t, skin_material, pant_material, false);
        let r_leg_transform = body_transform.times(Mat4.translation(0.5,0,0));
        this.draw_leg(context, program_state, r_leg_transform, shadow_pass, t, skin_material, pant_material, true);

        //arms
        this.draw_arm(context, program_state, r_arm_transform, shadow_pass, t, skin_material, shirt_material);
        if (this.has_mic) {
            this.draw_mic_arm(context, program_state, l_arm_transform, shadow_pass, t, skin_material, shirt_material); 
        } else {
            this.draw_arm(context, program_state, l_arm_transform, shadow_pass, t, skin_material, shirt_material);    
        }

        //head
        let face_transform = location_transform
            .times(Mat4.rotation(-head_angle,1,0,0))
            .times(Mat4.translation(0,4.3,head_radius));
        this.draw_face(context, program_state, face_transform, shadow_pass, t, skin_material, head_radius, arm_angle/2, eye_state, mouth_state);

        let neck_transform = face_transform.times(Mat4.translation(0,2-4.3,-head_radius))
             .times(Mat4.scale(.35,.4,.4));
        this.shapes.cc.draw(context, program_state, neck_transform, !shadow_pass? this.pure : skin_material);

        let l_ear_transform = face_transform.times(Mat4.translation(head_radius-.1,2*head_radius-.9-4.3,-head_radius))
                         .times(Mat4.scale(.35,.4,.4))
                         .times(Mat4.rotation(-Math.PI/8,0,0,1))
                         .times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.cc.draw(context, program_state, l_ear_transform, !shadow_pass? this.pure : skin_material);
        let r_ear_transform = face_transform.times(Mat4.translation(-head_radius+.1,2*head_radius-.9-4.3,-head_radius))
                         .times(Mat4.scale(.35,.4,.4))
                         .times(Mat4.rotation(Math.PI/8,0,0,1))
                         .times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.cc.draw(context, program_state, r_ear_transform, !shadow_pass? this.pure : skin_material);

        head_transform = face_transform.times(Mat4.translation(0,.05,-head_radius))
                         .times(Mat4.scale(head_radius,head_radius-.01,head_radius));
        this.shapes.s.draw(context, program_state, head_transform, !shadow_pass? this.pure : skin_material);
    }

display(context, program_state) {
        const gl = context.context;

        if (!this.init_ok) {
            const ext = gl.getExtension('WEBGL_depth_texture');
            if (!ext) {
                return alert('need WEBGL_depth_texture');  // eslint-disable-line
            }
            this.texture_buffer_init(gl);

            this.init_ok = true;
        }

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, -1, -18));
        }
    
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        this.set_location(dt); 
        this.location_transform = this.move_character(Mat4.identity(), dt);
        //const light_position = vec4(0, 10, 0, 1);
        // default: 8??
        let x_offset = this.location_transform[0][3];
        let z_offset = this.location_transform[2][3];
        this.light_position = Mat4.rotation(0, 0, 1, 0).times(vec4(3+x_offset, 15, 5+z_offset, 1));
        //this.light_color = color(1,1,1,1);
        if (this.stage == Backgrounds.DAY) 
            this.light_color = hex_color("#ffe096");
        else if (this.stage == Backgrounds.FUJI)
            this.light_color = hex_color("#dae7f2");
        else if (this.stage == Backgrounds.NIGHT)
            this.light_color = hex_color("#4877bd");
        else
            this.light_color = hex_color("#ff822e");

        // This is a rough target of the light.
        // Although the light is point light, we need a target to set the POV of the light
        this.light_view_target = vec4(0, 0, 0, 1);
        this.light_field_of_view = 130 * Math.PI / 180; // 130 degree

        let light_intensity = this.is_dark ? 200 : 2000;
        program_state.lights = [new Light(this.light_position, this.light_color, light_intensity)];

        // Step 1: set the perspective and camera to the POV of light
        const light_view_mat = Mat4.look_at(
            vec3(this.light_position[0], this.light_position[1], this.light_position[2]),
            vec3(this.light_view_target[0], this.light_view_target[1], this.light_view_target[2]),
            vec3(0, 1, 0), // assume the light to target will have a up dir of +y, maybe need to change according to your case
        );
        const light_proj_mat = Mat4.perspective(this.light_field_of_view, 1, 0.5, 500);
        // Bind the Depth Texture Buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.viewport(0, 0, this.lightDepthTextureSize, this.lightDepthTextureSize);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Prepare uniforms
        program_state.light_view_mat = light_view_mat;
        program_state.light_proj_mat = light_proj_mat;
        program_state.light_tex_mat = light_proj_mat;
        program_state.view_mat = light_view_mat;
        program_state.projection_transform = light_proj_mat;
        this.render_scene(context, program_state, false,false, false);

        // Step 2: unbind, draw to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        program_state.view_mat = program_state.camera_inverse;
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        this.render_scene(context, program_state, true,true, true);
    }

    draw_face(context, program_state, model_transform, shadow_pass, t, skin_material, head_radius, tail_angle, eye_state, mouth_state) {
        let hair_material = !shadow_pass? this.pure : this.darken_maybe(this.materials.hair.override({color:this.hair_color}));
        let hair_hide = !shadow_pass? this.pure : this.darken_maybe(this.materials.hair.override({color:this.hair_color, diffusivity: 0, specularity: .1}));
        let hair_low = !shadow_pass? this.pure : this.darken_maybe(this.materials.hair.override({color:this.hair_color, diffusivity: .2, specularity: .1}));
        let eye_material = !shadow_pass? this.pure : this.darken_maybe(this.materials.eye);
        let eye_white = !shadow_pass? this.pure : this.darken_maybe(this.materials.eye.override({color:hex_color("#ffffff")}));
        let tear = !shadow_pass? this.pure : this.darken_maybe(this.materials.eye.override({color:hex_color("#80b7ff")}));
        skin_material = !shadow_pass? this.pure : skin_material; 

        this.shapes.t.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.5*head_radius,-head_radius))
                .times(Mat4.scale(head_radius+.1,3,head_radius+.1))
                .times(Mat4.rotation(Math.PI/2,1,0,0))
                ,hair_material);
        this.shapes.t.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.5*head_radius-.4,-head_radius+.05))
                .times(Mat4.scale(head_radius+.2,3.4,head_radius+.3))
                .times(Mat4.rotation(Math.PI/2,1,0,0))
                ,hair_hide);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.7*head_radius-.5,-head_radius+.1))
                .times(Mat4.scale(head_radius+.17,1.5,head_radius+.26))
                ,hair_material);
        // back of head
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.1,-head_radius-.3))
                .times(Mat4.scale(head_radius,head_radius+.09,head_radius))
                ,hair_low);
        //sideburn
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(-2.35,.36,-1.8))
                .times(Mat4.rotation(-Math.PI/2,0,1,0))
                .times(Mat4.scale(1,1.6,.3))
                ,hair_material);
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(2.35,.36,-1.8))
                .times(Mat4.rotation(Math.PI/2,0,1,0))
                .times(Mat4.scale(1,1.6,.3))
                ,hair_material);

        //cat 
        if (this.has_cat) {
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(2.3,1.97,-1.))
                .times(Mat4.translation(-1,0,0))
                .times(Mat4.rotation(-tail_angle/2,1,-1,0))
                .times(Mat4.translation(1,0,0))
                .times(Mat4.rotation(-Math.PI/3.5,0,0,1)) 
                .times(Mat4.rotation(-Math.PI/2,1,0,0))
                .times(Mat4.scale(.9,.5,.7))   
                ,hair_material);
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(2.1,1.77,-.85))
                .times(Mat4.translation(-.55,0,0))
                .times(Mat4.rotation(-tail_angle/2,1,-1,0))
                .times(Mat4.translation(.55,0,0))
                .times(Mat4.rotation(-Math.PI/3.5,0,0,1))
                .times(Mat4.rotation(-Math.PI/2,1,0,0))
                .times(Mat4.scale(.7,.5,.6))   
                ,!shadow_pass? this.pure : hair_low.override({color: hex_color("#edede4")}));
                         
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(-2.3,1.97,-1.))
                .times(Mat4.translation(1,0,0))
                .times(Mat4.rotation(-tail_angle/2,1,1,0))
                .times(Mat4.translation(-1,0,0))
                .times(Mat4.rotation(Math.PI/3.5,0,0,1)) 
                .times(Mat4.rotation(-Math.PI/2,1,0,0))
                .times(Mat4.scale(.9,.5,.7))   
                ,hair_material);
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(-2.1,1.77,-.85))
                .times(Mat4.translation(.55,0,0))
                .times(Mat4.rotation(-tail_angle/2,1,1,0))
                .times(Mat4.translation(-.55,0,0))
                .times(Mat4.rotation(Math.PI/3.5,0,0,1))
                .times(Mat4.rotation(-Math.PI/2,1,0,0))
                .times(Mat4.scale(.7,.5,.6))   
                ,!shadow_pass? this.pure : hair_low.override({color: hex_color("#edede4")}));   
        }



        if (this.hair_style == HairStyles.HORN) {
            //bangs
//             this.shapes.ct.draw(context, program_state, 
//                 model_transform.times(Mat4.translation(0,.7,.2))
//                     .times(Mat4.scale(1,1,.3))
//                     ,hair_hide);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,.5,.2))
                  .times(Mat4.rotation(-Math.PI/25,1,0,0))
                    .times(Mat4.scale(1.2,1.6,.3))
                    ,hair_low);
            //middle-side bangs
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(1.6,.4,-.6))
                    .times(Mat4.rotation(Math.PI/20,0,0,1))
                    .times(Mat4.rotation(Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_low);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(-1.6,.4,-.6))
                    .times(Mat4.rotation(-Math.PI/20,0,0,1))
                    .times(Mat4.rotation(-Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_low);
            //horn
            this.shapes.rcc.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,.5*head_radius+.5,head_radius-1.7))
                    .times(Mat4.rotation(-Math.PI/8,1,0,0))
                    .times(Mat4.scale(.8,.8,.7))   
                    ,hair_material);
        }
        else if (this.hair_style == HairStyles.EDGY) {
            //bangs
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,.7,.2))
                    .times(Mat4.scale(1,1,.3))
                    ,hair_hide);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,.45,.2))
                    .times(Mat4.rotation(-Math.PI/25,1,0,0))
                    .times(Mat4.scale(1.2,1.8,.3))
                    .times(Mat4.rotation(Math.PI/10,0,0,1))
                    ,hair_low);                
            //side bands
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(1.6,.2,-.65))
                    .times(Mat4.rotation(Math.PI/17,0,0,1))
                    .times(Mat4.rotation(Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.8,1.85,.3))
                    ,hair_low); // R
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(-1.8,.37,-.6))
                    .times(Mat4.rotation(-Math.PI/20,0,0,1))
                    .times(Mat4.rotation(-Math.PI/4,0,1,0))
                    .times(Mat4.scale(.8,1.8,.3))
                    ,hair_low);                 
        }
        else if (this.hair_style == HairStyles.TAIL) {
            // middle bangs
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(1.6,.4,-.6))
                    .times(Mat4.rotation(Math.PI/20,0,0,1))
                    .times(Mat4.rotation(Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_low);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(-1.6,.4,-.6))
                    .times(Mat4.rotation(-Math.PI/20,0,0,1))
                    .times(Mat4.rotation(-Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_low);    

            let hairband = !shadow_pass? this.pure : hair_material.override({color:hex_color("#246b52")});
            let hair_ornament = !shadow_pass? this.pure : hair_material.override({color:hex_color("#a32933")});
            //LHS tail
            this.shapes.cc.draw(context, program_state,
            model_transform.times(Mat4.translation(head_radius,1.5,-.5*head_radius-.5))
                    .times(Mat4.rotation(Math.PI/16,0,0,1))
                    .times(Mat4.rotation(Math.PI/2,0,1,0))
                    .times(Mat4.scale(.35,.35,.35))
                , hairband);    
            this.shapes.s.draw(context, program_state,
            model_transform.times(Mat4.translation(head_radius,1.9,-.5*head_radius-.3))
                    .times(Mat4.rotation(Math.PI/16,0,0,1))
                    .times(Mat4.rotation(Math.PI/2,0,1,0))
                    .times(Mat4.scale(.25,.25,.25))
                , hair_ornament);  
            this.shapes.rcc.draw(context, program_state,
            model_transform
                     .times(Mat4.translation(head_radius-.1,1.5,-.5*head_radius-.5))
                     .times(Mat4.rotation(-Math.PI/2,0,1,0))
                     .times(Mat4.translation(0,0,-.2))
                      .times(Mat4.rotation(-tail_angle,0,1,0))
                    .times(Mat4.translation(0,0,-.2))
                     .times(Mat4.scale(.5,.5,.8))
                , hair_material);                    

            //RHS tail
            this.shapes.cc.draw(context, program_state,
            model_transform.times(Mat4.translation(-head_radius,1.5,-.5*head_radius-.5))
                    .times(Mat4.rotation(Math.PI/16,0,0,1))
                    .times(Mat4.rotation(Math.PI/2,0,1,0))
                    .times(Mat4.scale(.35,.35,.35))
                , hairband);    
            this.shapes.s.draw(context, program_state,
            model_transform.times(Mat4.translation(-head_radius,1.9,-.5*head_radius-.3))
                    .times(Mat4.rotation(Math.PI/16,0,0,1))
                    .times(Mat4.rotation(Math.PI/2,0,1,0))
                    .times(Mat4.scale(.25,.25,.25))
                , hair_ornament);  
            this.shapes.rcc.draw(context, program_state,
            model_transform
                     .times(Mat4.translation(-head_radius+.1,1.5,-.5*head_radius-.5))
                     .times(Mat4.rotation(Math.PI/2,0,1,0))
                     .times(Mat4.translation(0,0,-.2))
                      .times(Mat4.rotation(tail_angle,0,1,0))
                    .times(Mat4.translation(0,0,-.2))
                     .times(Mat4.scale(.5,.5,.8))
                , hair_material);                    
        }
        else {

        }
        
        //face/chin
        this.shapes.t.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,-head_radius+1.4,-head_radius+.7))
                .times(Mat4.rotation(-Math.PI/25,1,0,0))
                .times(Mat4.scale(.8*head_radius,3.4,.6*head_radius))
                .times(Mat4.rotation(Math.PI/2,1,0,0))
                ,skin_material);

        //eye
        if (eye_state == EyeStyle.OPEN || eye_state == EyeStyle.CRY) {
        this.shapes.t2.draw(context, program_state, 
            model_transform.times(Mat4.translation(-.5*head_radius+.3,-head_radius+1.5,-.26))
                .times(Mat4.rotation(.3,1,0,0))
                .times(Mat4.rotation(-.3,0,1,0))
                .times(Mat4.scale(.45,.45,1))
                ,eye_material);
        this.shapes.t2.draw(context, program_state, 
            model_transform.times(Mat4.translation(.5*head_radius-.3,-head_radius+1.5,-.26))
                .times(Mat4.rotation(.3,1,0,0))
                .times(Mat4.rotation(.3,0,1,0))
                .times(Mat4.scale(.45,.45,1))
                ,eye_material);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(-.5*head_radius+.3,-head_radius+1.5,-.26))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(-.3,0,1,0))
                .times(Mat4.scale(.2,.2,.05))
                ,eye_white);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(.5*head_radius-.3,-head_radius+1.5,-.26))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(.3,0,1,0))
                .times(Mat4.scale(.2,.2,.05))
                ,eye_white);
        }
        else if (eye_state == EyeStyle.ANIME) {
        this.shapes.t2.draw(context, program_state, //L eye
            model_transform.times(Mat4.translation(-.5*head_radius+.3,-head_radius+1.5,-.234))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(-.3,0,1,0))
                .times(Mat4.scale(.55,.55,1))
                ,eye_white);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(-.5*head_radius+.3,-head_radius+1.5,-.26))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(-.3,0,1,0))
                .times(Mat4.scale(.38,.38,.05))
                ,eye_material);
        this.shapes.s.draw(context, program_state, // s
            model_transform.times(Mat4.translation(-.5*head_radius+.18,-head_radius+1.35,-.4))
                .times(Mat4.rotation(-.8,0,0,1))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(-.3,0,1,0))
                .times(Mat4.scale(.2,.2,.1))
                ,eye_white);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(-.5*head_radius+.42,-head_radius+1.6,-.2))
                .times(Mat4.rotation(-.8,0,0,1))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(-.3,0,1,0))
                .times(Mat4.scale(.2,.2,.1))
                ,eye_white);
                
        this.shapes.t2.draw(context, program_state, //R eye
            model_transform.times(Mat4.translation(.5*head_radius-.3,-head_radius+1.5,-.234))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(.3,0,1,0))
                .times(Mat4.scale(.55,.55,1))
                ,eye_white);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(.5*head_radius-.3,-head_radius+1.5,-.26))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(.3,0,1,0))
                .times(Mat4.scale(.38,.38,.05))
                ,eye_material);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(.5*head_radius-.5,-head_radius+1.35,-.3))
                .times(Mat4.rotation(.8,0,0,1))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(.3,0,1,0))
                .times(Mat4.scale(.2,.2,.1))
                ,eye_white);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(.5*head_radius-.16,-head_radius+1.6,-.3))
                .times(Mat4.rotation(-.1,0,0,1))
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(.3,0,1,0))
                .times(Mat4.scale(.2,.2,.1))
                ,eye_white);

        }
        else {
        //closed eye
        this.shapes.cube.draw(context, program_state, 
            model_transform.times(Mat4.translation(-.85,-.9,-.4))
                .times(Mat4.rotation(-Math.PI/8,0,1,0))
                .times(Mat4.scale(.25,.1,.1))
            , eye_material);

        this.shapes.cube.draw(context, program_state, 
            model_transform.times(Mat4.translation(.85,-.9,-.4))
                .times(Mat4.rotation(Math.PI/8,0,1,0))
                .times(Mat4.scale(.25,.1,.1))
            , eye_material);

        }

        //cry
        if (this.cry) {
            let cry_x = -.5*head_radius+.1;
            let cry_y = -head_radius+1.35;
            const X_INC = .3; 
            const CRY_PERIOD = 1;
            let cry_t = t % CRY_PERIOD;
            if (cry_t < CRY_PERIOD/4) {}
            else if (cry_t < CRY_PERIOD/2) {
                cry_x -= X_INC;
                cry_y -= .2;
            }
            else if (cry_t < 3*CRY_PERIOD/4) {
                cry_x -= 2*X_INC;
                cry_y -= .4;
            }
            else {
                cry_x -= 3*X_INC;
                cry_y -= .8;
            }
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(cry_x,cry_y,-.4))
                    .times(Mat4.rotation(-.8,0,0,1))
                    .times(Mat4.rotation(.2,1,0,0))
                    .times(Mat4.rotation(-.3,0,1,0))
                    .times(Mat4.scale(.12,.15,.1))
                    ,tear);
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(-cry_x,cry_y,-.4))
                    .times(Mat4.rotation(.8,0,0,1))
                    .times(Mat4.rotation(.2,1,0,0))
                    .times(Mat4.rotation(.3,0,1,0))
                    .times(Mat4.scale(.12,.15,.1))
                    ,tear);
        }
       
        
        //mouth
        if (mouth_state == MouthStyle.V) {
            this.shapes.cube.draw(context, program_state, 
                model_transform.times(Mat4.translation(.08,-1.5,-.25))
                    .times(Mat4.rotation(Math.PI/10,1,0,0))
                    .times(Mat4.rotation(Math.PI/4,0,0,1))
                    .times(Mat4.scale(.16,.05,.0001))
                , eye_material);   
            this.shapes.cube.draw(context, program_state, 
                model_transform.times(Mat4.translation(-.08,-1.5,-.25))
                    .times(Mat4.rotation(Math.PI/10,1,0,0))
                    .times(Mat4.rotation(-Math.PI/4,0,0,1))
                    .times(Mat4.scale(.16,.05,.0001))
                , eye_material);          
        }
        else if (mouth_state == MouthStyle.OPEN) {
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,-1.5,-.3))
                    .times(Mat4.scale(.28,.15,.1))
                    ,eye_white);
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,-1.5,-.32))
                    .times(Mat4.scale(.3,.18,.1))
                    ,eye_material);            
        }
        else { // closed
        this.shapes.cube.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,-1.5,-.25))
                .times(Mat4.scale(.2,.05,.0001))
            , eye_material);
        }

    }


}










class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;

            varying vec3 color;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                color = phong_model_lights( normalize( N ), vertex_worldspace );
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            varying vec3 color;
            void main(){                                                           
                // Compute an initial (ambient) color:
                gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                gl_FragColor.xyz += color;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            gl_Position = projection_camera_model_transform * vec4( position, 1.0);
            point_position = model_transform * vec4(position, 1.0);
            center = model_transform * vec4( 0.0, 0.0, 0.0, 1.0);
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            float d = length(point_position.xyz - center.xyz);
            float v = (sin(d * 30.) + 1.) /2.;
            gl_FragColor = vec4(1.25*v, .61*v, .29*v, 1.);
        }`;
    }
}

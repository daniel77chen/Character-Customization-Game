import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Hair_Test extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Requirement 6)
        this.arrays.position = Vector3.cast(
            [-1, -1, 0], //0 
            [1, -1, 0],  //1
            [1, 1, 0],  //2
            [-1, 1, 0], //3
            [-1, -1, 1], //4
            [1, -1, 1]); //5 
        this.arrays.normal = Vector3.cast(
            [-1, -1, 0], //0 
            [1, -1, 0],  //1
            [1, 1, 0],  //2
            [-1, 1, 0], //3
            [-1, -1, 1], //4
            [1, -1, 1]); //5 
        this.indices.push(
            0,2,3, //back
            0,1,2,
            2,5,1, //side
            1,0,5, //bot 
            4,5,0,
            3,4,0 //side
        );
    }
}

class Hair_V_Shape extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Requirement 6)
        this.arrays.position = Vector3.cast(
            [-.1, -1, 0], //0 
            [.1, -1, 0],  //1
            [1, 1, 0],  //2
            [-1, 1, 0], //3
            [-1, 1, 1], //4
            [1, 1, 1]); //5 
        this.arrays.normal = Vector3.cast(
            [-.1, -1, 0], //0 
            [.1, -1, 0],  //1
            [1, 1, 0],  //2
            [-1, 1, 0], //3
            [-1, 1, 1], //4
            [1, 1, 1]); //5 
        this.indices.push(
            0,2,3, //back
            0,1,2,
            2,5,1, //side
            1,0,5, //bot 
            4,5,0,
            3,4,0 //side
        );
    }
}

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

export class Final_Project extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.x_coord = this.y_coord = 0;
        this.direction_angle = 0;
        this.lower_clothing = this.upper_clothing = this.shoes = "";

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
               s: new defs.Subdivision_Sphere(4),
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
               plane: new defs.Subdivision_Sphere(2),
               square: new defs.Square(),
               hair: new Hair_Test(),
               hair_v: new Hair_V_Shape(),
               cube: new defs.Cube(),

        };

        // *** Materials
        this.materials = {
                test: new Material(new defs.Phong_Shader(),
                    {ambient: .5, diffusivity: .6, specularity: 1, color: hex_color("#edea47")}),
                shirt: new Material(new defs.Phong_Shader(),
                    {ambient: .5, diffusivity: .6, specularity: 1, color: hex_color("#faacac")}),
                pants: new Material(new defs.Phong_Shader(),
                    {ambient: .5, diffusivity: .6, specularity: 1, color: hex_color("#4794ed")}),
                floor: new Material(new defs.Phong_Shader(),
                    {ambient: .5, diffusivity: .6, specularity: .1, color: hex_color("#e1e6e4")}),
                hair: new Material(new defs.Phong_Shader(),
                    {ambient: .5, diffusivity: .5, specularity: .7, color: hex_color("#755e48")}),
                hair2: new Material(new defs.Phong_Shader(),
                    {ambient: .5, diffusivity: .5, specularity: .7, color: hex_color("#231c38")}),
                eye: new Material(new defs.Phong_Shader(),
                    {ambient: .5, diffusivity: 0, specularity: 0, color: hex_color("#291515")}),
        }

// not sure if we need this since im not using it rn 
        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.skin_color = hex_color("#f5d990");
        this.hair_color = hex_color("#755e48");
        this.is_wearing_shirt = this.is_wearing_pants = true;
        this.hair_style = HairStyles.HORN;
        this.eye_style = EyeStyle.CRY;
        this.mouth_open = false;
        this.cry = true;
    }

    set_skin_color(col) {
        this.skin_color = hex_color(col);
    }

    set_hair(hs) {
        this.hair_style = hs;
        switch (hs) {
            case HairStyles.HORN:
                this.hair_color = hex_color("#cc9e3b");
                break;
            case HairStyles.EDGY:
                this.hair_color = hex_color("#231c38");
                break;
            case HairStyles.TAIL:
                this.hair_color = hex_color("#eb8df0");
                break;
            case HairStyles.BOWL:
            default:
                this.hair_color = hex_color("#755e48");
                
        }
    }
    
    set_direction_angle(new_angle) {
        let difference = this.direction_angle - new_angle;
        //console.log("DIFFERENCE= " + difference);
        if(difference === 90 || difference === -90)
            return new_angle + difference/2;
        else if(difference === 270 || difference === -270)
            return 315;
        else if(difference === 0)
            return this.direction_angle;
        else 
            return new_angle; 
    }

    make_control_panel() {
        this.key_triggered_button("Move Backwards", ["W"], () => 
            {this.y_coord = this.y_coord - 0.2; this.direction_angle = this.set_direction_angle(180); }); //console.log("GOING THIS DIRECTION: " + this.direction_angle); console.log("---");});
        this.key_triggered_button("Move Left",      ["A"], () => 
            {this.x_coord = this.x_coord - 0.2; this.direction_angle = this.set_direction_angle(270); });  //console.log("GOING THIS DIRECTION: " + this.direction_angle); console.log("---");});
        this.key_triggered_button("Move Forward",   ["S"], () => 
            {this.y_coord = this.y_coord + 0.2; this.direction_angle = this.set_direction_angle(0); });  //console.log("GOING THIS DIRECTION: " + this.direction_angle); console.log("---");});
        this.key_triggered_button("Move Right",     ["D"], () => 
            {this.x_coord = this.x_coord + 0.2; this.direction_angle = this.set_direction_angle(90); });  //console.log("GOING THIS DIRECTION: " + this.direction_angle); console.log("---");});
        this.key_triggered_button("Reset Clothing", ["Control", "0"], () => {
            this.lower_clothing = "";
            this.upper_clothing = "";
            this.shoes = "";
        });
        this.new_line();
        this.key_triggered_button("Red Pants", ["Control", "1"], () => {
             this.lower_clothing = "red_pants";
        });
        this.new_line();
        this.key_triggered_button("Shorts", ["Control", "2"], () => {
            this.lower_clothing = "shorts";
        });
        this.new_line();
        this.key_triggered_button("Short Sleeve Shirt", ["Control", "3"], () => {
            this.upper_clothing = "short_sleeve";
        });
        this.new_line();
        this.key_triggered_button("Long Sleeve Shirt", ["Control", "4"], () => {
            this.upper_clothing = "long_sleeve";
        });
        this.new_line();
        
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

    this.key_triggered_button("Default", ["Hair"], () => {this.set_hair(HairStyles.HORN)});
    this.key_triggered_button("Edgy", ["Hair"], () => {this.set_hair(HairStyles.EDGY)});
    this.key_triggered_button("Ponytail", ["Hair"], () => {this.set_hair(HairStyles.TAIL)});
    this.key_triggered_button("Bowl", ["Hair"], () => {this.set_hair(HairStyles.BOWL)});

    this.key_triggered_button("Default", ["Skin"], () => {this.set_skin_color("#f5d990")});
    this.key_triggered_button("Sunburnt", ["Skin"], () => {this.set_skin_color("#ffb885")});
    this.key_triggered_button("Banana", ["Skin"], () => {this.set_skin_color("#edea47")});
    this.new_line();
    this.key_triggered_button("Normal", ["Eye"], () => {this.eye_style = EyeStyle.OPEN; this.cry = false;});
    this.key_triggered_button("Cry", ["Eye"], () => {this.eye_style = EyeStyle.CRY; this.cry = true;});
    this.key_triggered_button("Anime", ["Eye"], () => {this.eye_style = EyeStyle.ANIME; this.cry = false;});
    this.new_line();
    this.key_triggered_button("Is it wearing a shirt?", ["?"], () => {
            this.is_wearing_shirt ^= 1;
        });
    this.key_triggered_button("Is it wearing pants?", ["?"], () => {
            this.is_wearing_pants ^= 1;
        });

    }

    draw_face(context, program_state, model_transform, t, skin_material, head_radius, tail_angle, eye_state) {
        let hair_material = this.materials.hair.override({color:this.hair_color});
        let eye_material = this.materials.eye;
        let eye_white = this.materials.eye.override({color:hex_color("#ffffff")});
        let tear = this.materials.eye.override({color:hex_color("#80b7ff")});

        this.shapes.t.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.5*head_radius,-head_radius))
                .times(Mat4.scale(head_radius+.1,3,head_radius+.1))
                .times(Mat4.rotation(Math.PI/2,1,0,0))
                ,hair_material);
        this.shapes.t.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.5*head_radius-.4,-head_radius+.05))
                .times(Mat4.scale(head_radius+.2,3.4,head_radius+.3))
                .times(Mat4.rotation(Math.PI/2,1,0,0))
                ,hair_material);
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.7*head_radius-.5,-head_radius+.1))
                .times(Mat4.scale(head_radius+.17,1.5,head_radius+.26))
                ,hair_material);
        // back of head
        this.shapes.s.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,.1,-head_radius-.3))
                .times(Mat4.scale(head_radius,head_radius+.09,head_radius))
                ,hair_material);
        //sideburn
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(-2.35,.4,-1.8))
                .times(Mat4.rotation(-Math.PI/2,0,1,0))
                .times(Mat4.scale(1,1.6,.3))
                ,hair_material);
        this.shapes.ct.draw(context, program_state, 
            model_transform.times(Mat4.translation(2.35,.4,-1.8))
                .times(Mat4.rotation(Math.PI/2,0,1,0))
                .times(Mat4.scale(1,1.6,.3))
                ,hair_material);


        if (this.hair_style == HairStyles.HORN) {
            //bangs
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,.7,.2))
                    .times(Mat4.scale(1,1,.3))
                    ,hair_material);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,.5,.2))
                  .times(Mat4.rotation(-Math.PI/25,1,0,0))
                    .times(Mat4.scale(1.2,1.6,.3))
                    ,hair_material);
            //middle-side bangs
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(1.6,.4,-.6))
                    .times(Mat4.rotation(Math.PI/20,0,0,1))
                    .times(Mat4.rotation(Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_material);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(-1.6,.4,-.6))
                    .times(Mat4.rotation(-Math.PI/20,0,0,1))
                    .times(Mat4.rotation(-Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_material);
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
                    ,hair_material);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,.5,.2))
                    .times(Mat4.rotation(-Math.PI/25,1,0,0))
                    .times(Mat4.scale(1.2,1.8,.3))
                    .times(Mat4.rotation(Math.PI/10,0,0,1))
                    ,hair_material);                
            //side bands
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(1.6,.2,-.65))
                    .times(Mat4.rotation(Math.PI/17,0,0,1))
                    .times(Mat4.rotation(Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.8,1.85,.3))
                    ,hair_material); // R
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(-1.8,.4,-.6))
                    .times(Mat4.rotation(-Math.PI/20,0,0,1))
                    .times(Mat4.rotation(-Math.PI/4,0,1,0))
                    .times(Mat4.scale(.8,1.8,.3))
                    ,hair_material);                 
        }
        else if (this.hair_style == HairStyles.TAIL) {
            // middle bangs
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(1.6,.4,-.6))
                    .times(Mat4.rotation(Math.PI/20,0,0,1))
                    .times(Mat4.rotation(Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_material);
            this.shapes.ct.draw(context, program_state, 
                model_transform.times(Mat4.translation(-1.6,.4,-.6))
                    .times(Mat4.rotation(-Math.PI/20,0,0,1))
                    .times(Mat4.rotation(-Math.PI/4,0,1,0))
                    .times(Mat4.scale(1.5,1.8,.3))
                    ,hair_material);    

            let hairband = hair_material.override({color:hex_color("#246b52")});
            let hair_ornament = hair_material.override({color:hex_color("#a32933")});
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
                .times(Mat4.rotation(.2,1,0,0))
                .times(Mat4.rotation(-.3,0,1,0))
                .times(Mat4.scale(.45,.45,1))
                ,eye_material);
        this.shapes.t2.draw(context, program_state, 
            model_transform.times(Mat4.translation(.5*head_radius-.3,-head_radius+1.5,-.26))
                .times(Mat4.rotation(.2,1,0,0))
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

        // cry?
        if (this.cry) {
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(-.5*head_radius+.1,-head_radius+1.35,-.4))
                    .times(Mat4.rotation(-.8,0,0,1))
                    .times(Mat4.rotation(.2,1,0,0))
                    .times(Mat4.rotation(-.3,0,1,0))
                    .times(Mat4.scale(.12,.15,.1))
                    ,tear);
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(.5*head_radius-.1,-head_radius+1.35,-.4))
                    .times(Mat4.rotation(.8,0,0,1))
                    .times(Mat4.rotation(.2,1,0,0))
                    .times(Mat4.rotation(.3,0,1,0))
                    .times(Mat4.scale(.12,.15,.1))
                    ,tear);
        }
       
        
        //mouth
        if (this.mouth_open) {
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,-1.5,-.3))
                    .times(Mat4.scale(.28,.15,.1))
                    ,eye_white);
            this.shapes.s.draw(context, program_state, 
                model_transform.times(Mat4.translation(0,-1.5,-.32))
                    .times(Mat4.scale(.3,.18,.1))
                    ,eye_material);            
        }
        else {
        this.shapes.cube.draw(context, program_state, 
            model_transform.times(Mat4.translation(0,-1.5,-.25))
                .times(Mat4.scale(.2,.05,.0001))
            , eye_material);
        }

    }

    
    draw_leg(context, program_state, model_transform, t, skin_material, pant_material) {
        let feet = model_transform.times(Mat4.translation(0,0,-3.65)).times(Mat4.scale(0.5,0.5,0.5));
        model_transform = model_transform
                            .times(Mat4.scale(0.35,0.35,1.2))
                            .times(Mat4.translation(0,0,-(0.5+0.5)))
                            ;
        this.shapes.cc.draw(context, program_state, model_transform, pant_material);
        model_transform = model_transform
                            .times(Mat4.scale(0.9,0.9,1.2))
                            .times(Mat4.translation(0,0,-0.9))
                            ;
        this.shapes.cc.draw(context, program_state, model_transform, pant_material);

        this.shapes.s.draw(context, program_state, feet, skin_material);
        return model_transform;
    }

    draw_arm(context, program_state, model_transform, t, skin_material, shirt_material){
        let hand_transform = model_transform
                                .times(Mat4.scale(0.5,0.5,0.5))
                                .times(Mat4.translation(0,0,-2))
                                ;
        model_transform = model_transform
                                .times(Mat4.scale(0.3,0.3,2.5))
                                .times(Mat4.translation(0,0,0.3))                                
                                ;
        this.shapes.cc.draw(context, program_state, model_transform, shirt_material);
        this.shapes.s.draw(context, program_state, hand_transform, skin_material);
        return model_transform;
    }
    
    move_character(model_transform, t) {
        model_transform = model_transform
            .times(Mat4.translation(this.x_coord, 0, this.y_coord))
            .times(Mat4.rotation(this.direction_angle*Math.PI/180,0,1,0));
        return model_transform
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, 0, -30));
        }

    
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let sun_scaler = 2 - Math.cos(2*t*Math.PI/5);
        
//         program_state.set_camera(this.attached);
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const BLINK_PERIOD = 5;
        const mod_t = t % BLINK_PERIOD;
        let eye_state = this.eye_style;
        if (mod_t == 0) {
            eye_state = this.eye_style;
        }
        else if (mod_t >= BLINK_PERIOD -1 && mod_t < BLINK_PERIOD) {
            eye_state = EyeStyle.CLOSED;
        }
        //console.log(mod_t);

        // lighting from asssignment 3 
        const light_position = vec4(0, 10, 0, 1);
        //const light_position = vec4(0, 10, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 50)];
        //program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10**sun_scaler)];
        let skin_material = this.materials.test.override({color:this.skin_color});
        
        let ident = Mat4.identity();
        let location_transform = this.move_character(Mat4.identity(), t);
        let body_transform = location_transform.times(Mat4.rotation(-Math.PI/2,1,0,0));
        let head_transform = Mat4.identity();
        let head_radius = 2.3;
        let arm_angle = Math.sin(2*t)/2;
        let head_angle = Math.sin(2*t)/16;
        //let head_angle = 0;
        let r_arm_transform = body_transform
                            .times(Mat4.translation(1.9,0,0))
                            .times(Mat4.translation(-1.25,0,1.5))
                            .times(Mat4.rotation(arm_angle,1,0,0))
                            .times(Mat4.translation(1.25,0,-1.5))
                            .times(Mat4.rotation(-0.7,0,1,0));
        let l_arm_transform = body_transform
                            .times(Mat4.translation(-1.9,0,0))
                            .times(Mat4.translation(-1.25,0,1.5))
                            .times(Mat4.rotation(-arm_angle,1,0,0))
                            .times(Mat4.translation(1.25,0,-1.5))
                            .times(Mat4.rotation(0.7,0,1,0));

        // head
        // (side, up, depth)
        this.shapes.plane.draw(context, program_state, ident.times(Mat4.translation(0,-5,0)
            .times(Mat4.scale(100,.001,100))), this.materials.floor);

        let face_transform = location_transform
            .times(Mat4.rotation(-head_angle,1,0,0))
            .times(Mat4.translation(0,4.3,head_radius));
        this.draw_face(context, program_state, face_transform, t, skin_material, head_radius, arm_angle/2, eye_state);

        let neck_transform = face_transform.times(Mat4.translation(0,2-4.3,-head_radius))
             .times(Mat4.scale(.35,.4,.4));
        this.shapes.cc.draw(context, program_state, neck_transform, skin_material);

        let l_ear_transform = face_transform.times(Mat4.translation(head_radius-.1,2*head_radius-.9-4.3,-head_radius))
                         .times(Mat4.scale(.35,.4,.4))
                         .times(Mat4.rotation(-Math.PI/8,0,0,1))
                         .times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.cc.draw(context, program_state, l_ear_transform, skin_material);
        let r_ear_transform = face_transform.times(Mat4.translation(-head_radius+.1,2*head_radius-.9-4.3,-head_radius))
                         .times(Mat4.scale(.35,.4,.4))
                         .times(Mat4.rotation(Math.PI/8,0,0,1))
                         .times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.cc.draw(context, program_state, r_ear_transform, skin_material);

        head_transform = face_transform.times(Mat4.translation(0,.05,-head_radius))
                         .times(Mat4.scale(head_radius,head_radius-.01,head_radius));
        this.shapes.s.draw(context, program_state, head_transform, skin_material);
        

        //body & legs
        let shirt_material = this.is_wearing_shirt ? this.materials.shirt : skin_material;
        let pant_material = this.is_wearing_pants ? this.materials.pants : skin_material;
        this.shapes.cc.draw(context, program_state, body_transform.times(Mat4.scale(1,1,2)), shirt_material);
        body_transform = body_transform.times(Mat4.translation(0,0,1));
        this.shapes.s.draw(context, program_state, body_transform.times(Mat4.scale(1,1,1)), shirt_material);
        body_transform = body_transform.times(Mat4.translation(0,0,-2));
        this.shapes.s.draw(context, program_state, body_transform.times(Mat4.scale(1,1,1)), pant_material);
        
        let l_leg_transform = body_transform.times(Mat4.translation(-0.5,0,0));
        this.draw_leg(context, program_state, l_leg_transform, t, skin_material, pant_material);
        let r_leg_transform = body_transform.times(Mat4.translation(0.5,0,0));
        this.draw_leg(context, program_state, r_leg_transform, t, skin_material, pant_material);

        //arms
        this.draw_arm(context, program_state, r_arm_transform, t, skin_material, shirt_material);
        this.draw_arm(context, program_state, l_arm_transform, t, skin_material, shirt_material);

//         if(this.attached !== undefined) {
//             let desired = this.attached();
//             if (desired === "solar") { 
//                 desired = this.initial_camera_location;
//             } else {
//                 desired = Mat4.inverse(desired.times(Mat4.translation(0,0,5)));
//             }
//             desired = desired.map((x,i) => Vector.from( program_state.camera_inverse[i]).mix(x, 0.1));
//             program_state.set_camera(desired);
//         }
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

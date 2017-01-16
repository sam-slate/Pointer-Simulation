//Provides an interpreter and simulation for C++ pointers
//Sam Slate, Janurary 2017
//With help from Benjamin Clements and nshan.nnnn

//************ Defines the Memory Objects ********

angleMode = "radians";

//Takes in a vector and an angle
//and returns the vector rotated by the given angle
var v_rotate = function(vector, angle){
    var old_x = vector.x;
    var old_y = vector.y;
    var new_x = old_x * cos(angle) - old_y * sin(angle);
    var new_y = old_y * cos(angle) + old_x * sin(angle);
    return new PVector(new_x, new_y);
};

//Takes in the x1, y1, x2 and y2 coordinates
//of an arrow and draws it in a pseudo-random color
//based off its coordinates
var draw_arrow = function(x1, y1, x2, y2){
    var r = (x1 * y1 + y2) % 255; 
    var g = (x1 - y1 * y2) % 255;
    var b = (x2 * y1 - y2) % 255;
    stroke(r, g, b);

    //defines a vector that is the body of the arrow
    var a_body = new PVector(x2 - x1, y2 - y1);
    
    //makes the body of the arrow
    line(x1, y1, x1 + a_body.x, y1 + a_body.y);
    
    //defines the relative vectors of the two little
    //edges of the arrows
                
    var e1 = v_rotate(a_body, 5 * (PI/6));
    var e2 = v_rotate(a_body, 7 * (PI/6));
    
    e1.limit(20);
    e2.limit(20);
    
    //makes the end of the arrow
    line(x2, y2, x2 + e1.x, y2 + e1.y);
    line(x2, y2, x2 + e2.x, y2 + e2.y);

};

//Constructor for a single location in memory
var Memory_Location = function(name, value, pointer) {
    this.name = name;
    this.value = value;
    this.pointer = pointer;
};

//Constructor for all of the memory
var Memory = function(){
    this.array_memory = [];
    this.loc_h = 22;
    this.loc_w = 244;
    this.mem_x = 299;
    this.mem_y = 227;
};

//Updates memory
//Takes a name and a value
//Checks if the name already exists in the memory
//if it does, update the value at the place in memory
//if name does not already exist, add new Memory_location
//with name and value
//the pointer variable says whether the value is a pointer or not
Memory.prototype.update = function(name, value, pointer){
    for (var i = 0; i < this.array_memory.length; i++){
        if (this.array_memory[i].name === name){
            this.array_memory[i].value = value;
            this.array_memory[i].pointer = pointer;
            return;
        }
    }
    this.array_memory.push(new Memory_Location(name, value, pointer));
};

//Gets the memory location associated with given name
Memory.prototype.getMem = function(name){
    for (var i = 0; i < this.array_memory.length; i++){
        if (this.array_memory[i].name === name){
            return this.array_memory[i];
        }
    }
};

//Gets the index of the memory location associated with given name
Memory.prototype.getIndex = function(name){
    for (var i = 0; i < this.array_memory.length; i++){
        if (this.array_memory[i].name === name){
            return i;
        }
    }
};

//Displays the memory
Memory.prototype.display = function(){
    var num_mem = this.array_memory.length;
    var loc_h = this.loc_h;
    var loc_w = this.loc_w;
    var mem_x = this.mem_x;
    var mem_y = this.mem_y;
    
    fill(252, 252, 252);
    stroke(0, 0, 0);
    rect(mem_x, mem_y, loc_w, loc_h * num_mem);
    stroke(0, 0, 0);
    line(mem_x + (loc_w / 2), mem_y, mem_x + (loc_w / 2), mem_y + (loc_h * num_mem));
    
    for (var i = 0; i < num_mem; i++) {
        textSize(12);
        stroke(0, 0, 0);
        line(mem_x, mem_y + (i * loc_h), mem_x + loc_w, mem_y + (i * loc_h));
        fill(107, 18, 107);
        text(this.array_memory[i].name, mem_x + 20, mem_y + (i * loc_h) + 4+ (loc_h / 2));
        fill(59, 70, 191);
        if (!this.array_memory[i].pointer) {
            text(this.array_memory[i].value, mem_x + (loc_w / 2) + 20, mem_y + (i * loc_h) + 4 + (loc_h / 2));
        } else {
            var index = this.getIndex(this.array_memory[i].value);
            var x1 = mem_x + (loc_w / 2) + 20;
            var y1 = mem_y + (i * loc_h) + (loc_h / 2);
            var x2 = mem_x + (loc_w / 2) - 40;
            var y2 = mem_y + (index * loc_h) + (loc_h / 2);
            
            draw_arrow(x1, y1, x2, y2);
        }
    }
};

//Initialize new memory
var mem = new Memory();

//********* Error Handling ********

var is_error = false;
var error = "";

var set_error = function(msg){
    is_error = true;
    error = msg;
};

var display_error = function(){
    fill(255, 0, 0);
    text("Error: " + error, 45, 183);
};

//********* Initialize Text Variable ******

var t = ""; // will store the input text

//******* Storage for Past Lines **********

var past_lines = [];

var display_past_lines = function(){
    var top_y = 213;
    
    fill(0, 0, 0);
    textSize(20);
    text("Past Lines", 88, top_y);
    
    fill(99, 85, 230);
    textSize(16);
    
    //initialize variable to hold which past line we start
    //at
    var start_past_lines = 0;
    var max_past_lines = 10;
    
    //check if there are more than max_past_lines past lines
    if (past_lines.length > max_past_lines){
        //set the starting i to the length minus 10
        start_past_lines = past_lines.length - max_past_lines;
    }
    
    for (var i = start_past_lines; i < past_lines.length; i++){
        text(past_lines[i], 92, top_y + 27 + (21 * (i - start_past_lines)));
    }
};

//********** Input Text Button *********
var b_x = 453;
var b_y = 139;
var b_h = 28;
var b_w = 100;

var display_button = function() {
    fill(251, 255, 0);
    rect(b_x, b_y, b_w, b_h);
    fill(0, 0, 0);
    text("submit", b_x + 23, b_y + 20);
};

//********* Parse Line of Code ******

//The line will be parsed into 4 sections, stored
//in this array. This array should only ever have the
//4 sections
var line_4_sect = [];

//Holds the temporary line that will be parsed
var tmp = t;

//checks to see if the next character is a star
//and then a space
var is_next_star = function(){
    return (tmp.substr(0, 2) === "* ");
};

//checks to see if the next two characters
//are stars and then a space
var is_next_double_star = function(){
    return (tmp.substr(0, 3) === "** ");
};

//checks to see if the next character is an ampersand
//and then a space
var is_next_amp = function(){
    return (tmp.substr(0, 2) === "& ");
};

//Responsible for parsing the first chunk of the line
//Returns a bool of whether or not it was succesful
var parse_1st = function(){
    //check the length of the string
    if (tmp.length < 5){
        set_error("The line is too short");
        return false;
    }
    
    //check if first chunk is star
    if (is_next_star()){
        line_4_sect.push("*");
        tmp = tmp.substr(2);
        return true;
    //check if the first chunk is double star
    } else if (is_next_double_star()){
        line_4_sect.push("**");
        tmp = tmp.substr(3);
        return true;
    //check if the first chunk is "string"
    } else if (tmp.substr(0, 7) === "string "){
        tmp = tmp.substr(7);
        //now, check if the string is followed by stars
        if (is_next_star()){
            line_4_sect.push("string *");
            tmp = tmp.substr(2);
            return true;
        } else if (is_next_double_star()){
            line_4_sect.push("string **");
            tmp = tmp.substr(3);
            return true;
        //if it doesn't have stars, it's just a normal string
        } else {
            line_4_sect.push("string");
            return true;
        }
    } else {
        return false;
    }
};

//Responsible for parsing the second chunk of the line
//Returns a bool of whether or not it was succesful
var parse_2nd = function(){
    
    //find index of the = sign
    var pos = tmp.indexOf("=");
    
    //check if there is no equal sign
    if (pos === -1){
        set_error("There is no equal sign");
        return false;
    }
    
    //stores the 2nd chunk by getting the substring
    //from 0 to the position of the equal sign minus 1
    var tmp2nd = tmp.substr(0, pos - 1);
    
    //set tmp to just the string after the
    //equal sign and the space after it
    tmp = tmp.substr(pos + 2);
    
    if(tmp2nd === ""){
        set_error("There is no variable on the lefthand side");
        return false;
    }
    
    //check if tmp2nd starts with a quote
    //if so, return false
    if(tmp2nd[0] === "\""){
        set_error("Variable on the left side cannot be a string");
        return false;
    }
    
    //check if there is a space in tmp2nd
    if(tmp2nd.indexOf(" ") !== -1){
        set_error("Variable on the left side contains spaces");
        return false;
    }
    
    //If we've gotten this far, tmp2nd is valid!
    line_4_sect.push(tmp2nd);
    return true;
};

//Responsible for parsing the third chunk of the line
//Returns a bool of whether or not it was succesful
var parse_3rd = function(){
    //check if the third chunk is a star
    if (is_next_star()){
        line_4_sect.push("*");
        tmp = tmp.substr(2);
        return true;
    //check if the third chunk is double star
    } else if (is_next_double_star()){
        line_4_sect.push("**");
        tmp = tmp.substr(3);
        return true;
    //check if the third chunk is an ampersand
    } else if (is_next_amp()){
        line_4_sect.push("&");
        tmp = tmp.substr(2);
        return true;
    //if none, return false
    } else {
        return false;
    }
};

var parse_4th = function(){
    //check if the chunk is the empty string
    if (tmp.length < 1){
        set_error("There is no variable or string on the righthand side");
        return false;
    }

    //check if the chunk is not a string and thus must
    //be a variable and if it contains a space
    if (tmp[0] !== "\"" && tmp.indexOf(" ") !== -1){
        set_error("Variable on the right side contains spaces");
        return false;
    }
    
    //if we get this far, the chunk is good!
    line_4_sect.push(tmp);
    return true;
};

//Overall coordinating of parsing the line
var parse_line = function(){
    //resets the array
    line_4_sect = [];
    
    //trims t
    t = t.trim();
    
    //resets the tmp
    tmp = t;
    
    //check if there is a semicolon at the end
    if(tmp[tmp.length-1] === ";"){
        //remove the semicolon
        tmp = tmp.substring(0, tmp.length - 1);   
    } else {
        //set the error and return false
        set_error("Missin semicolon at the end of the line");
        is_error = true;
        return false;
    }
    
    //if no spaces after stars and ampersands, adds them
    tmp = tmp.replace(/\s*(\*\*|\*|=|&)\s*/g,' $1 ');
    tmp = tmp.replace(/\s+/g,' ');
    
    //trims tmp again
    tmp = tmp.trim();
    
    //stores whether the line is valid
    var is_valid = false;
    
    //Check if the first chunk is one of the predetermined
    //possibilies. If it is, parse_1st will return true and automatically
    //add the chunk to our array. If it doesn't, we will assume that
    //there is no first chunk
    is_valid = parse_1st();
    
    //Here, we assume that there is no first chunk so we push
    //an empty string to our array
    if(!is_valid){
        line_4_sect.push("");
    }
    
    //Check if the second chunk is valid
    is_valid = parse_2nd();
    
    //If it isn't valid, return false from the function
    if(!is_valid){
        return false;
    }
    
    //Check if the third chunk is valid
    is_valid = parse_3rd();
    
    //If not valid, assume that there was a blank in the third
    //chunk and push the empty string
    if(!is_valid){
        line_4_sect.push("");
    }
    
    is_valid = parse_4th();
    
    //If it isn't valid, return false from the function
    if(!is_valid){
        return false;
    } else {
        //set the error bool to false
        is_error = false;
        //return true
        return true;
    }
};

//********* Proccess Line **********

//if the first chunk is the empty string or a declaration
//if the second chunk is a variable
//if the third chunk is a star of some sort
var emptyordec_var_star = function(){
    //check if the fourth chunk is a string
    if(line_4_sect[3][0] === "\""){
        //raise error
        set_error("Cannot dereference a string");
    } else {
        //means fourth chunk is a variable
        //check to see if the third chunk is a single star
        if(line_4_sect[2] === "*"){
            //if so, store in a temporary
            //variable the memory location object associated with the 
            //name of the variable (which is the fourth chunk)
            var t1mem_loc = mem.getMem(line_4_sect[3]);
            
            //check if the pointer bool is true, if not, raise error
            if (!t1mem_loc.pointer){
                set_error("Cannot dereference a variable that is not a pointer");
                return;
            }
            
            //since it is a pointer, retrieve the memory location object
            //that it is pointing to and store it in a second temporary
            //variable
            var t2mem_loc = mem.getMem(t1mem_loc.value);
            
            //Now update the memory location with the name as the 
            //second chunk the value in the second temporary variable
            //and the pointer bool
            mem.update(line_4_sect[1], t2mem_loc.value, t2mem_loc.pointer);
        
        } else {
            //Then the third chunk is a double star. Store in a temporary
            //variable the memory location object associated with the 
            //name of the variable (which is the fourth chunk)
            var t1mem_loc = mem.getMem(line_4_sect[3]);
            
            //check if the pointer bool is true, if not, raise error
            if (!t1mem_loc.pointer){
                set_error("Cannot dereference a variable that is not a pointer");
                return;
            }
            
            //since it is a pointer, retrieve the memory location object
            //that it is pointing to and store it in a second temporary
            //variable
            var t2mem_loc = mem.getMem(t1mem_loc.value);
            
            //check if the pointer bool for the 2nd temp memory location object
            //is true. If not, raise error.
            if (!t2mem_loc.pointer){
                set_error("Cannot dereference a variable that is not a pointer");
                return;
            }
            
            //since it is a pointer, retrieve the memory location object
            //that it is pointing to and store it in a third temporary
            //variable
            var t3mem_loc = mem.getMem(t2mem_loc.value);
            
            //Now update the memory location with the name as the 
            //second chunk, the value in the third temporary variable
            //and the pointer bool from the third temporary variable
            mem.update(line_4_sect[1], t3mem_loc.value, t3mem_loc.pointer);
        }
    }

};

//if the first chunk is the empty string or a declaration
//if the second chunk is a variable
//if the third chunk is empty
var emptyordec_var_empty = function(){
    //check to see if the fourth chunk is a string
    if (line_4_sect[3][0] === "\""){
        //if it is, update the memory location with the name
        //as the second chunk, the value as the fourth chunk,
        //and the pointer value as false
        mem.update(line_4_sect[1], line_4_sect[3], false);
    } else {
        //if the fourth chunk is a variable, store in a temporary
        //variable the memory location object associated with the 
        //name of the variable (which is the fourth chunk)
        var t_mem_location = mem.getMem(line_4_sect[3]);
        
        //update the memory location with the name as the 
        //second chunk the value in the temporary variable
        //and the pointer bool
        mem.update(line_4_sect[1], t_mem_location.value, t_mem_location.pointer);
    }

};

//if the first chunk is the empty string or a declaration
//if the second chunk is a variable
//if the third chunk is an ampersand
var emptyordec_var_amp = function() {
    //check if the fourth chunk is a string
    if(line_4_sect[3][0] === "\""){
        //raise error
        set_error("Cannot take the address of a string");
    } else {
        //The fourth chunk must be a variable
        //Update the memory with the second chunk as the name,
        //the fourth chunk as the value, and the pointer bool
        //set to true
        mem.update(line_4_sect[1], line_4_sect[3], true);
    }
};

//if the first chunk is the empty string or a declaration
var emptyordec = function(){
    //check if the third chunk is star
    if (line_4_sect[2][0] === "*"){
        emptyordec_var_star();
    //if note, check if the third chunk is empty
    } else if (line_4_sect[2] === ""){
        emptyordec_var_empty();
    } else {
        //The third chunk must be an ampersand then
        emptyordec_var_amp();
    }

};

//if the first chunk is some kind of star
//if the second chunk is a variable
//if the third chunk is a single star
var star_var_lonelystar = function(){
    
    //initialize the final memory location that will be used later
    var tfmem_loc;
    
    //check to see if the first chunk is one star
    if (line_4_sect[0] === "*"){
        //if so, store in a temporary
        //variable the memory location object associated with the 
        //name of the variable on the left (which is the second chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
            
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a final temporary
        //variable
        tfmem_loc = mem.getMem(t1mem_loc.value);    
    } else {
        //Then the third chunk is a double star. Store in a temporary
        //variable the memory location object associated with the 
        //name of the variable (which is the fourth chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        var t2mem_loc = mem.getMem(t1mem_loc.value);
        
        //check if the pointer bool for the 2nd temp memory location object
        //is true. If not, raise error.
        if (!t2mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        tfmem_loc = mem.getMem(t2mem_loc.value);
    }
    
    //store in a temporary
    //variable the memory location object associated with the 
    //name of the variable on the right (which is the fourth chunk)
    var t3mem_loc = mem.getMem(line_4_sect[3]);
            
    //check if the pointer bool is true, if not, raise error
    if (!t3mem_loc.pointer){
        set_error("Cannot dereference a variable that is not a pointer");
        return;
    }
        
    //since it is a pointer, retrieve the memory location object
    //that it is pointing to and store it in a final temporary
    //variable
    var t4mem_loc = mem.getMem(t3mem_loc.value);
    
    //update the memory at the name stored in tfmem_loc as
    //found earlier with the value and pointer of t4mem_loc
    mem.update(tfmem_loc.name, t4mem_loc.value, t4mem_loc.pointer);
    
};

//if the first chunk is some kind of star
//if the second chunk is a variable
//if the third chunk is two stars
var star_var_twostar = function(){
    
    //initialize the final memory location that will be used later
    var tfmem_loc;
    
    //check to see if the first chunk is one star
    if (line_4_sect[0] === "*"){
        //if so, store in a temporary
        //variable the memory location object associated with the 
        //name of the variable on the left (which is the second chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
            
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a final temporary
        //variable
        tfmem_loc = mem.getMem(t1mem_loc.value);    
    } else {
        //Then the third chunk is a double star. Store in a temporary
        //variable the memory location object associated with the 
        //name of the variable (which is the fourth chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        var t2mem_loc = mem.getMem(t1mem_loc.value);
        
        //check if the pointer bool for the 2nd temp memory location object
        //is true. If not, raise error.
        if (!t2mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        tfmem_loc = mem.getMem(t2mem_loc.value);
    }
    
    //store in a temporary
    //variable the memory location object associated with the 
    //name of the variable on the right (which is the fourth chunk)
    var t3mem_loc = mem.getMem(line_4_sect[3]);
            
    //check if the pointer bool is true, if not, raise error
    if (!t3mem_loc.pointer){
        set_error("Cannot dereference a variable that is not a pointer");
        return;
    }
        
    //since it is a pointer, retrieve the memory location object
    //that it is pointing to and store it in temporary
    //variable
    var t4mem_loc = mem.getMem(t3mem_loc.value);
    
    //check if the pointer bool for this temp memory location object
    //is true. If not, raise error.
    if (!t4mem_loc.pointer){
        set_error("Cannot dereference a variable that is not a pointer");
        return;
    }
        
    //since it is a pointer, retrieve the memory location object
    //that it is pointing to and store it in a second temporary
    //variable
    var t5mem_loc = mem.getMem(t4mem_loc.value);
    
    //update the memory at the name stored in tfmem_loc as
    //found earlier with the value and pointer of t5mem_loc
    mem.update(tfmem_loc.name, t5mem_loc.value, t5mem_loc.pointer);
};

//if the first chunk is a star of some sort
//if the second chunk is a variable
//if the third chunk is a star of some sort
var star_var_star = function(){
    //check if the second star is alone
    if (line_4_sect[2] === "*"){
        star_var_lonelystar();
    } else {
        //second star is not alone
        star_var_twostar();
    }
};

//if the first chunk is a star
//if the second chunk is var
//if the third chunk is empty
var star_var_empty = function(){
   
    //initialize the final memory location that will be used later
    var tfmem_loc;
    
    //check to see if the first chunk is one star
    if (line_4_sect[0] === "*"){
        //if so, store in a temporary
        //variable the memory location object associated with the 
        //name of the variable on the left (which is the second chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
            
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a final temporary
        //variable
        tfmem_loc = mem.getMem(t1mem_loc.value);    
    } else {
        //Then the third chunk is a double star. Store in a temporary
        //variable the memory location object associated with the 
        //name of the variable (which is the fourth chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        var t2mem_loc = mem.getMem(t1mem_loc.value);
        
        //check if the pointer bool for the 2nd temp memory location object
        //is true. If not, raise error.
        if (!t2mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        tfmem_loc = mem.getMem(t2mem_loc.value);
    }
    
    //check to see if the fourth chunk is a string
    if(line_4_sect[3][0] === "\""){
        //if it is, then update the name retrieved from
        //dereferencing earlier (stored as the name of 
        //tfmem_loc) with the value of the string and the false bool
        mem.update(tfmem_loc.name, line_4_sect[3], false);
    } else {
        //if not, then it is a variable. Retrieve the memory
        //location object from the variable
        var t3mem_loc = mem.getMem(line_4_sect[3]);
        
        //update the name retrrieved from dereferencing earlier
        //(stored as the name of tfmem_loc) with the value
        //and the pointer of t3mem_loc
        mem.update(tfmem_loc.name, t3mem_loc.value, t3mem_loc.pointer);
    }
};

//if the first chunk is a star
//if the second chunk is a var
//if the third chunk is an ampersand
var star_var_amp = function(){
    //check to see if the fourth chunk is a string
    if (line_4_sect[3][0] === "\""){
        //if so set error
        set_error("Cannot get the address of a string");
        return;
    }
    
    //initialize the final memory location that will be used later
    var tfmem_loc;
    
    //check to see if the first chunk is one star
    if (line_4_sect[0] === "*"){
        //if so, store in a temporary
        //variable the memory location object associated with the 
        //name of the variable on the left (which is the second chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
            
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a final temporary
        //variable
        tfmem_loc = mem.getMem(t1mem_loc.value);    
    } else {
        //Then the third chunk is a double star. Store in a temporary
        //variable the memory location object associated with the 
        //name of the variable (which is the fourth chunk)
        var t1mem_loc = mem.getMem(line_4_sect[1]);
            
        //check if the pointer bool is true, if not, raise error
        if (!t1mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        var t2mem_loc = mem.getMem(t1mem_loc.value);
        
        //check if the pointer bool for the 2nd temp memory location object
        //is true. If not, raise error.
        if (!t2mem_loc.pointer){
            set_error("Cannot dereference a variable that is not a pointer");
            return;
        }
        
        //since it is a pointer, retrieve the memory location object
        //that it is pointing to and store it in a second temporary
        //variable
        tfmem_loc = mem.getMem(t2mem_loc.value);
    }
    
    //Since we checked at the start that the fourth chunk is not
    //a string, it must be a variable. Update the name retrieved from
    //dereferencing earlier (stored as the name of 
    //tfmem_loc) with the name of the variable and the true bool 
    mem.update(tfmem_loc.name, line_4_sect[3], true);
};

//if the first chunk is some type of star
var star = function(){
    //check if the third chunk is star
    if (line_4_sect[2][0] === "*"){
        star_var_star();
    //if note, check if the third chunk is empty
    } else if (line_4_sect[2] === ""){
        star_var_empty();
    } else {
        //The third chunk must be an ampersand then
        star_var_amp();
    }

};

//overall proccess line function
var proccess_line = function (){
    
    //checks if the first chunk is the empty string or
    //a string declaration
    if (line_4_sect[0] === "" || line_4_sect[0][0] === "s"){
        emptyordec();
    } else {
    //that means the first chunk is a star or a double star
        star();
    }
    

};

//********** Deal with mouse clicked ********

//Called when the submit button is clicked or when
//enter is pressed
var submit_line = function (){
    //check if the line is valid and parse it
    //into our array of four chunks
    var is_valid = parse_line();
        
    //if the line is invalid, return from the function
    if(!is_valid){
        return;
    }
        
    proccess_line();
        
    //checks if there is an error
    if(!is_error){
        //adds the current line t to the list of past lines
        past_lines.push(t);
        //resets t
        t = ""; 
    }

};

mouseClicked = function (){
    //check if the mouse click is within the submit button
    if (mouseX >= b_x && mouseX <= (b_x + b_w) &&
        mouseY >= b_y && mouseY <= (b_y + b_h))
    {
        submit_line();
    }
};

//******** Makes Input Text ************

//Credit to nshan.nnnn for this section

var alph = "abcdefghijklmnopqrstuvwxyz"; //our alphabet

var keyPressed = function() // special function that is called whenever a key is pressed
{
    if(keyCode >= 65 && keyCode <= 90) // if the key is a letter...
    {
        t += alph[keyCode - 65]; // add it to the text
    }
    else if(keyCode === 32) // if the key is the space...
    {
        t += " "; // add some space...
    }
    else if(keyCode === 8) // if the key is the delete
    {
        t = t.substring(0, t.length - 1);
    }
    else if(keyCode === 55) //if the key is 7, add &
    {
        t += "&";
    }
    else if(keyCode === 56)
    {
        t += "*";
    }
    else if(keyCode === 187)
    {
        t += "=";
    }
    else if(keyCode === 222)
    {
        t += "\"";
    } 
    else if(keyCode === 186)
    {
        t += ";";
    }else if(keyCode === 10){
        //user presses enter, call submit function
        submit_line();
    }
};

//********** Formatting **********

var display_top = function () {
    //writes out top section
    textSize(30);
    fill(0, 0, 0);
    text("C++ Pointer Interpreter and Simulation", 46, 46);
    fill(255, 186, 255);
    text("C++ Pointer Interpreter and Simulation", 45, 45);
    
    fill(0, 0, 0);
    textSize(16);
    text("Hello! This program was built to help visualize how pointers work in C++. Enter", 13, 76);
    
    text("a line of code by typing and submit by either pressing the button or the enter key.", 13, 98);
    
    text("Look at the bottom for some syntax restrictions and example code.", 13, 120);
};

var display_bottom = function () {
    fill(241, 250, 240);
    rect(9, 472, 582, 121);
    
    //write out syntax rules
    textSize(16);
    fill(36, 89, 7);
    text("Syntax Rules:", 20, 500);
    
    fill(0, 0, 0);
    textSize(13);
    text("- Every line must be in the form _ = _", 42, 520);
    text("- Strings are the only available type", 42, 540);
    text("- The only operators are =, *, **, and &", 42, 560);

    //Write out example code
    textSize(16);
    fill(36, 89, 7);
    text("Example Code:", 290, 500);
    
    fill(0, 0, 0);
    textSize(13);
    text("string test = \"hello\";", 312, 520);
    text("string *hello = &test;", 312, 540);
    text("*hello = \"boo\";", 312, 560);
    text("string **yo = &hello;", 450, 520);
    text("**yo = *why;", 450, 540);
    text("whoops = **nope;", 450, 560);
    
    textSize(10);
    fill(74, 74, 74);
    text("Sam Slate", 537, 586);
};

//to keep track of the blinker 
var blinker = 0;
var length_of_blinker = 50;

//************ The draw function **********

var draw = function() {
    //sets background of blue
    background(220, 237, 245);
    
    //display the top section
    display_top();
    
    //display the bottom section
    display_bottom();
    
    
    //sets the input text and adds semicolon for effect
    textSize(20);
    fill(20, 102, 20);
    
    //Sets the text that will print
    var to_print = "Input: " + t;
    
    //increment blinker
    blinker++;
    
    //check if blinker should be added
    if (blinker > length_of_blinker){
        to_print = to_print + "|";
    } 
    
    //check if blinker should be turned off
    if (blinker > 2 * length_of_blinker){
        blinker = 0;
    }
    
    //Print the text
    text(to_print,46,157);
    
    //sets text size
    textSize(18);
    
    //display input text button
    display_button();
    
    //display error if there is one
    if (is_error){
        display_error();
    }
    
    //displays the memory
    fill(0, 0, 0);
    textSize(20);
    text("Memory", 385, 212);
    textSize(14);
    text("Variable", 306, 218);
    text("Value", 497, 218);
    mem.display();
    textSize(12);
    
    //displays past lines
    display_past_lines();
};

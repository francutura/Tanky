const Constants = require('../const/constants');

class Map {
    
    constructor(){
        this.map = []
        this.spawn_points = []
        for (let i = 0; i < (Constants.MAP_SIZE / Constants.TILE_WIDTH); i++){
            this.map.push([])
            for (let j = 0; j < (Constants.MAP_SIZE / Constants.TILE_HEIGHT); j++){
                    this.map[i].push(0)
            }
        }
    }

    make_line(starting_point_x, starting_point_y, length_x, length_y){
        for (let i = starting_point_y; i < starting_point_y + length_y; i++){
            for(let j = starting_point_x; j < starting_point_x + length_x; j++){
                this.map[i][j] = 1
            }
        }
    }

    make_diagonal_line(starting_point_x, starting_point_y, length, direction){
        for (let i = 0; i < length; i++){
            if (direction == true)
                this.map[starting_point_y + i][starting_point_x + i] = 1
            else
                this.map[starting_point_y + i][starting_point_x - i] = 1
        }
    }

    make_U_Z(starting_point_x, starting_point_y, length_x, length_y, left_direction, right_direction){
        for (let i = 0; i < length_x; i++){
            this.map[starting_point_y][starting_point_x + i] = 1
        }
    
        for (let i = 0; i < length_y; i++){
            if(left_direction == true)
                this.map[starting_point_y - i][starting_point_x] = 1
            else
                this.map[starting_point_y + i][starting_point_x] = 1
        }
    
        for (let i = 0; i < length_y; i++){
            if(right_direction == true)
                this.map[starting_point_y - i][starting_point_x + length_x - 1] = 1
            else
                this.map[starting_point_y + i][starting_point_x + length_x - 1] = 1
        }
    }

    make_simbol(starting_point_x, starting_point_y, length){
        for(let i = 0; i < length; i++){
            this.map[starting_point_y][starting_point_x + i] = 1 //gornja horizontalna
            this.map[starting_point_y + length][starting_point_x + i] = 1 //donja horizontalna
            this.map[starting_point_y + i][starting_point_x + length - 1] = 1 //desna vertikalna
            this.map[starting_point_y + Math.round(i/2)][starting_point_x] = 1 //pola lijeve vertikalne
            this.map[starting_point_y + Math.round(length/2)][starting_point_x + Math.round(i/2)] = 1 //pola horizontalne
        }
    }

    push_point(x_point, y_point, bodya_point){
        let point = {
            x: x_point * Constants.TILE_WIDTH,
            y: y_point * Constants.TILE_HEIGHT,
            bodya: bodya_point
        }
        this.spawn_points.push(point)
    }



    generate_map1(){
        //map
        for (let i = 0; i < (Constants.MAP_SIZE / Constants.TILE_WIDTH); i++){
            for (let j = 0; j < (Constants.MAP_SIZE / Constants.TILE_HEIGHT); j++){
                    this.map[i][j] = 0
            }
        }
        this.make_line(5, 5, 10, 3)
        this.make_line(5, 10, 3, 10)

        this.make_line(28, 5, 1, 11)
        this.make_line(23, 4, 9, 1)

        this.make_diagonal_line(15, 25, 6, true)
        this.make_diagonal_line(11, 25, 6, false)
        this.make_U_Z(8, 40, 10, 5, true, true)

        this.make_line(5, 45, 10, 2)
        this.make_line(23, 48, 2, 8)


        this.make_U_Z(20, 20, 10, 10, true, false)

        this.make_line(38, 3, 1, 5)
        this.make_line(38, 11, 1, 5)
        this.make_diagonal_line(55, 5, 7, false)

        this.make_simbol(35, 20, 15)
        this.make_diagonal_line(29, 35, 5, false)
        this.make_U_Z(35, 45, 8, 7, true, false)

        this.make_line(34, 50, 3, 3)

        this.make_line(52, 37, 3, 3)
        this.make_line(52, 45, 3, 3)
        this.make_line(52, 53, 3, 3)

        //spawn points
        this.spawn_points = []
        this.push_point(8, 2, 1.57)
        this.push_point(13, 15, 0)
        this.push_point(13, 34, 3)
        this.push_point(12, 53, 1.57)
        this.push_point(39, 42, 0)
        this.push_point(45, 32, 4.8)
        this.push_point(34, 8, 2.9)
        this.push_point(56, 13, 4.7)
        this.push_point(43, 56, 5.6)
        this.push_point(24, 15, 9)

    }

    generate_map2(){
        //map
        for (let i = 0; i < (Constants.MAP_SIZE / Constants.TILE_WIDTH); i++){
            for (let j = 0; j < (Constants.MAP_SIZE / Constants.TILE_HEIGHT); j++){
                    this.map[i][j] = 0
            }
        }

        this.make_U_Z(5, 10, 9, 6, true, false)
        this.make_diagonal_line(5, 20, 5, true)
        this.make_diagonal_line(10, 30, 5, false)
        this.make_diagonal_line(5, 40, 5, true)
        this.make_diagonal_line(10, 50, 5, false)

        this.make_diagonal_line(18, 4, 9, true)
        this.make_simbol(38, 2, 13)

        //1.row
        this.make_line(25, 20, 3, 3)
        this.make_line(32, 20, 3, 3)
        this.make_line(39, 20, 3, 3)
        //this.make_line(46, 20, 3, 3)
        //this.make_line(53, 20, 3, 3)

        //2.row
        this.make_line(25, 27, 3, 3)
        this.make_line(32, 27, 3, 3)
        this.make_line(39, 27, 3, 3)

        //3.row
        this.make_line(25, 34, 3, 3)
        this.make_line(32, 34, 3, 3)
        this.make_line(39, 34, 3, 3)

        this.make_U_Z(25, 43, 20, 5, false, false)
        this.make_line(34, 50, 2, 2)
        this.make_U_Z(25, 59, 20, 5, true, true)

        //spawn points
        this.spawn_points = []
        this.push_point(10, 3, 1.57)
        this.push_point(7, 28, 1.57)
        this.push_point(7, 48, 1.57)
        this.push_point(35, 56, 0)
        this.push_point(54, 32, 4.72)
        this.push_point(33, 32, 4.72)
        this.push_point(41, 6.5, 1.57)
        this.push_point(26, 3, 3)
        this.push_point(35, 40, 0)
        this.push_point(56, 9, 4.8)

    }

    random_map(){
        let n = Math.random()
        if(n < 0.5){
            this.generate_map1()
        }
        else{
            this.generate_map2()
        }
    }


}

module.exports = Map;

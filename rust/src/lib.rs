use rand::Rng;
use std::time::SystemTime;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use web_sys::console;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
struct Letter {
    id: String,
    // A, B, C etc yk
    key: char,

    row: i32,

    column: i32,
}

impl Letter {
    pub fn new(id: String, key: char, row: i32, column: i32) -> Letter {
        Letter {
            id,
            column,
            key,
            row,
        }
    }
}

const ALPHABET: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SIZE: i32 = 5;
const DIRECTIONS: [[i32; 2]; 8] = [
    [-1, 0],  // up
    [0, 1],   // right
    [1, 0],   // down
    [0, -1],  // left
    [-1, 1],  // up-right
    [1, 1],   // down-right
    [1, -1],  // down-left
    [-1, -1], // up-left
];

fn get_all_combinations<'a>(
    grid: &'a Vec<Vec<Letter>>,
    row: i32,
    col: i32,
    visited: &mut Vec<Vec<bool>>,
    mut combination: Vec<&'a Letter>,
    all_combinations: &mut Vec<Vec<&'a Letter>>,
    desired: i32,
) {
    if row < 0 || row >= SIZE || col < 0 || col >= SIZE || visited[row as usize][col as usize] {
        return;
    }

    visited[row as usize][col as usize] = true;

    combination.push(&grid[row as usize][col as usize]);
    if combination.len() == desired as usize {
        all_combinations.push(combination);
    } else {
        for [dx, dy] in DIRECTIONS.into_iter() {
            get_all_combinations(
                grid,
                row + dx,
                col + dy,
                visited,
                combination.clone(),
                all_combinations,
                desired,
            );
        }
    }

    // combination.clone().pop();
    visited[row as usize][col as usize] = false;
}

fn get_random_char() -> char {
    let mut rng = rand::thread_rng();
    let random_index = rng.gen_range(0..ALPHABET.len());
    let random_char = ALPHABET.chars().nth(random_index).unwrap();
    random_char
}

#[wasm_bindgen]
pub fn getWords(_grid: JsValue) {
    console::log_1(&"bruh1".into());
    let grid = jsvalue_to_2d_array(_grid).unwrap();

    console::log_1(&"bruh2".into());

    let mut all_combinations: Vec<Vec<&Letter>> = vec![];
    let combination: Vec<&Letter> = vec![];
    let mut visited: Vec<Vec<bool>> = vec![vec![false; SIZE as usize]; SIZE as usize];

    // start the recursive process from each cell in the grid
    let start = SystemTime::now();

    for row1 in 0..SIZE {
        for col1 in 0..SIZE {
            get_all_combinations(
                &grid,
                row1,
                col1,
                &mut visited,
                combination.clone(),
                &mut all_combinations,
                10,
            );
        }
    }
    let end = SystemTime::now();
    let duration = end.duration_since(start).unwrap();

    // for (_, row) in all_combinations.iter().enumerate() {
    //     let res = row
    //         .iter()
    //         .map(|x| String::from(x.key))
    //         .collect::<Vec<String>>()
    //         .join("");
    //     print!("{}\n", res);
    // }
    println!("it took {} seconds", duration.as_secs());
    println!("ho, {:?}", all_combinations.len());
}

fn jsvalue_to_2d_array(js_value: JsValue) -> Option<Vec<Vec<Letter>>> {
    js_value.into_serde().ok()
}

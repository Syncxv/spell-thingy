use rand::Rng;
// use std::time::SystemTime;

use serde::{Deserialize, Serialize};
use serde_json;
use wasm_bindgen::prelude::*;

use web_sys::console;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Letter {
    key: char,

    row: i32,

    column: i32,
}

impl Letter {
    pub fn new(key: char, row: i32, column: i32) -> Letter {
        Letter { column, key, row }
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
    grid: &'a Vec<Letter>,
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

    combination.push(&grid[row as usize * SIZE as usize + col as usize]);
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
pub fn getWords(_grid: JsValue, n: i32) -> String {
    console::log_1(&"bruh1".into());
    let grid: Vec<Letter> = _grid.into_serde().unwrap();

    console::log_1(&"bruh2".into());

    let mut all_combinations: Vec<Vec<&Letter>> = vec![];
    let combination: Vec<&Letter> = vec![];
    let mut visited: Vec<Vec<bool>> = vec![vec![false; SIZE as usize]; SIZE as usize];

    // start the recursive process from each cell in the grid
    // let start = SystemTime::now();

    for row1 in 0..SIZE {
        for col1 in 0..SIZE {
            get_all_combinations(
                &grid,
                row1,
                col1,
                &mut visited,
                combination.clone(),
                &mut all_combinations,
                n,
            );
        }
    }
    // let end = SystemTime::now();
    // let duration = end.duration_since(start).unwrap();

    // for (_, row) in all_combinations.iter().enumerate() {
    //     let res = row
    //         .iter()
    //         .map(|x| String::from(x.key))
    //         .collect::<Vec<String>>()
    //         .join("");
    //     print!("{}\n", res);
    // }
    // println!("it took {} seconds", duration.as_secs());
    println!("ho, {:?}", all_combinations.len());
    console::log_1(&"bruh3 done".into());

    let serialized = serde_json::to_string(&all_combinations).unwrap();
    serialized
}

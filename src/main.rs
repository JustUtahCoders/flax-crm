#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
use postgres::{Client, NoTls};
use serde::Deserialize;
use rocket_contrib::json::Json;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[derive(Deserialize)]
struct NounToCreate {
    friendly_name: String
}

#[post("/api/nouns", data = "<noun_to_create>")]
fn create_noun(noun_to_create: Json<NounToCreate>) -> Json<String> {
    let mut client = Client::connect("postgresql://postgres:password@localhost/crm", NoTls).unwrap();
    let nouns = client.query("INSERT INTO nouns (friendly_name) VALUES ($1) RETURNING *;", &[&noun_to_create.friendly_name]).unwrap();
    println!("nouns {:#?}", nouns);
    Json(String::from("Worked"))
}

fn main() {
    rocket::ignite().mount("/", routes![index, create_noun]).launch();
}
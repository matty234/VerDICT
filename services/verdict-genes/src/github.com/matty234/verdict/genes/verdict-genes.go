package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/matty234/verdict/verdict"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var (
	err    error
	driver neo4j.Driver
)

func NewPhenotypeFromRecord(r neo4j.Record) (p *verdict.Phenotype) {
	p = new(verdict.Phenotype)
	if value, ok := r.Get("name"); ok {
		p.Name = strings.Split(value.(string), "\t")
	}

	if value2, ok := r.Get("omim"); ok {
		p.Omim = value2.(int64)
	}

	if value, ok := r.Get("score"); ok {
		p.Score = value.(float64)
	}
	return
}

func NewGeneFromRecord(r neo4j.Record) (g *verdict.Gene) {
	g = new(verdict.Gene)
	if value, ok := r.Get("entrez"); ok {
		g.Entrez = value.(int64)
	}

	if value, ok := r.Get("official_symbol"); ok {
		g.OfficialSymbol = value.(string)
	}

	if value, ok := r.Get("score"); ok {
		g.Score = value.(float64)
	}

	return
}

func GetGene(entrez string) *verdict.Gene {
	iv, err := strconv.Atoi(entrez)
	if err != nil {
		log.Println("Could not parse value")
		return nil
	}

	session, err := driver.Session(neo4j.AccessModeRead)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	defer session.Close()

	result, err := session.Run("MATCH (n:GENE{entrez: $entrez}) RETURN n.entrez as entrez, n.official_symbol as official_symbol LIMIT 1;", map[string]interface{}{"entrez": iv})
	if err != nil {
		log.Fatal(err)
		return nil
	}

	var gene *verdict.Gene

	if result.Next() {
		gene = NewGeneFromRecord(result.Record())
	}
	return gene
}

func GetGeneRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	w.Header().Set("Content-Type", "application/json")
	var result = GetGene(params["entrez"])
	bytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
		w.Write([]byte("Could not write JSON"))
		return
	}
	w.Write(bytes)
}

func GetGenePhenotypes(entrez string) *[]verdict.Phenotype {
	iv, err := strconv.Atoi(entrez)
	if err != nil {
		log.Println("Could not parse value")
		return nil
	}

	session, err := driver.Session(neo4j.AccessModeRead)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	defer session.Close()

	result, err := session.Run("MATCH (:GENE{entrez: $entrez})<-[r:HAS_GENE]-(p) RETURN p.name as name, p.omim"+
		" as omim ORDER BY name DESC LIMIT 100;", map[string]interface{}{"entrez": iv})
	if err != nil {
		log.Fatal(err)
		return nil
	}

	phenotypes := []verdict.Phenotype{}

	for result.Next() {
		phenotypes = append(phenotypes, *NewPhenotypeFromRecord(result.Record()))
	}
	return &phenotypes
}

func GetGenePhenotypesRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	w.Header().Set("Content-Type", "application/json")
	var result = GetGenePhenotypes(params["entrez"])
	bytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
		w.Write([]byte("Could not write JSON"))
		return
	}
	w.Write(bytes)
}

func GetGeneInteractsWith(entrez string) *[]verdict.Gene {
	iv, err := strconv.Atoi(entrez)
	if err != nil {
		log.Println("Could not parse value")
		return nil
	}

	session, err := driver.Session(neo4j.AccessModeRead)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	defer session.Close()

	result, err := session.Run("MATCH (n:GENE{entrez: $entrez})-[:INTERACTS_WITH]-(k:GENE) "+
		"RETURN k.entrez as entrez, k.official_symbol as official_symbol;", map[string]interface{}{"entrez": iv})
	if err != nil {
		log.Fatal(err)
		return nil
	}

	genes := []verdict.Gene{}

	for result.Next() {
		genes = append(genes, *NewGeneFromRecord(result.Record()))
	}
	return &genes
}

func GetGeneInteractsWithRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	w.Header().Set("Content-Type", "application/json")
	var result = GetGeneInteractsWith(params["entrez"])
	bytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
		w.Write([]byte("Could not write JSON"))
		return
	}
	w.Write(bytes)
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Println(r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	dbUri := os.Getenv("DB_URI")

	if dbUri == "" {
		dbUri = "bolt://localhost"
	}

	dbUser := os.Getenv("DB_USER")

	if dbUser == "" {
		dbUser = "neo4j"
	}

	dbPassword := os.Getenv("DB_PASSWORD")

	if dbPassword == "" {
		dbPassword = "neo4j"
	}

	path := os.Getenv("HTTP_ROOT")

	rtr := mux.NewRouter()

	rtr.HandleFunc(path+"/{entrez:[0-9]+}", GetGeneRequest).Methods("GET")
	rtr.HandleFunc(path+"/{entrez:[0-9]+}/phenotypes", GetGenePhenotypesRequest).Methods("GET")
	rtr.HandleFunc(path+"/{entrez:[0-9]+}/interacts", GetGeneInteractsWithRequest).Methods("GET")
	rtr.Use(loggingMiddleware)

	driver, err = neo4j.NewDriver(dbUri, neo4j.BasicAuth(dbUser, dbPassword, ""))
	if err != nil {
		log.Fatal(err)
		return
	}
	defer driver.Close()

	handler := cors.Default().Handler(rtr)

	err = http.ListenAndServe(":"+port, handler)
	if err != nil {
		log.Fatal(err)
		return
	}
}

package main

import (
	"encoding/json"
	"github.com/matty234/verdict/verdict"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"github.com/rs/cors"

	"os"
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

var (
	err    error
	driver neo4j.Driver
)

func GetPhenotype(omim string) *verdict.Phenotype {
	iv, err := strconv.Atoi(omim)
	if err != nil {
		log.Fatal(err)
	}

	session, err := driver.Session(neo4j.AccessModeRead)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	defer session.Close()

	result, err := session.Run("MATCH (n:PHENOTYPE{omim: $omim}) RETURN n.omim as omim, n.name as name LIMIT 1;", map[string]interface{}{"omim": iv})
	if err != nil {
		log.Fatal(err)
		return nil
	}
	var phenotype *verdict.Phenotype

	if result.Next() {
		phenotype = NewPhenotypeFromRecord(result.Record())
	} else {
		log.Println("NADA")
	}
	return phenotype
}

func GetPhenotypeRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	log.Printf("Finding for %s", params["omim"])
	w.Header().Set("Content-Type", "application/json")
	var result = GetPhenotype(params["omim"])
	bytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
		w.Write([]byte("Could not write JSON"))
		return
	}
	w.Write(bytes)
}

func GetPhenotypeGenes(omim string, limit int) *[]verdict.Gene {
	iv, err := strconv.Atoi(omim)
	if err != nil {
		log.Fatal(err)
	}

	session, err := driver.Session(neo4j.AccessModeRead)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	defer session.Close()

	result, err := session.Run("MATCH (n:PHENOTYPE{omim: $omim})-[:HAS_GENE]-(g:GENE) RETURN g.entrez as entrez, "+
		"g.official_symbol as official_symbol ORDER BY official_symbol DESC LIMIT $limit;",
		map[string]interface{}{"omim": iv, "limit": limit})
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

func GetPhenotypeGenesRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	limits, ok := r.URL.Query()["limit"]

	if !ok || len(limits[0]) < 1 {
		limits = []string{"100"}
	}

	limit, err := strconv.Atoi(limits[0])

	w.Header().Set("Content-Type", "application/json")
	var result = GetPhenotypeGenes(params["omim"], limit)
	bytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
		w.Write([]byte("Could not write JSON"))
		return
	}
	w.Write(bytes)
}

func GetPhenotypeRelatedPhenotypes(omim string) *[]verdict.Phenotype {
	iv, err := strconv.Atoi(omim)
	if err != nil {
		log.Fatal(err)
	}

	session, err := driver.Session(neo4j.AccessModeRead)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	defer session.Close()

	result, err := session.Run("MATCH (a:PHENOTYPE{omim: $omim})-[r:RELATED_TO]->(p) WHERE a <> p RETURN p.name as name, p.omim"+
		" as omim, r.score as score ORDER BY r.score DESC LIMIT 100;", map[string]interface{}{"omim": iv})
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

func GetPhenotypeRelatedPhenotypesRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	log.Printf("Finding for %s", params["omim"])
	w.Header().Set("Content-Type", "application/json")
	var result = GetPhenotypeRelatedPhenotypes(params["omim"])
	bytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
		w.Write([]byte("Could not write JSON"))
		return
	}
	w.Write(bytes)
}

func GetPhenotypeCardigan(omim string, limit int) *[]verdict.Gene {
	iv, err := strconv.Atoi(omim)
	if err != nil {
		log.Fatal(err)
	}

	session, err := driver.Session(neo4j.AccessModeRead)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	defer session.Close()

	result, err := session.Run("MATCH (n:PHENOTYPE{omim: $omim})-[r:PREDICTED_INTERACTION]-(g:GENE) RETURN g.entrez as entrez, "+
		"g.official_symbol as official_symbol, r.score as score  ORDER BY r.score DESC LIMIT $limit;",
		map[string]interface{}{"omim": iv, "limit": limit})
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

func GetPhenotypeCardiganRequest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	limits, ok := r.URL.Query()["limit"]

	if !ok || len(limits[0]) < 1 {
		limits = []string{"100"}
	}

	limit, err := strconv.Atoi(limits[0])

	log.Printf("Finding for %s", params["omim"])
	w.Header().Set("Content-Type", "application/json")
	var result = GetPhenotypeCardigan(params["omim"], limit)
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

	dbUri := "bolt://"+os.Getenv("SVC_DB_SERVICE_HOST")

	if dbUri == "bolt://" {
		dbUri = "bolt://localhost:7688"
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
	rtr.Use(loggingMiddleware)
	rtr.HandleFunc(path + "/{omim:[0-9]+}", GetPhenotypeRequest).Methods("GET")
	rtr.HandleFunc(path + "/{omim:[0-9]+}/genes", GetPhenotypeGenesRequest).Methods("GET")
	rtr.HandleFunc(path + "/{omim:[0-9]+}/related", GetPhenotypeRelatedPhenotypesRequest).Methods("GET")
	rtr.HandleFunc(path + "/{omim:[0-9]+}/cardigan", GetPhenotypeCardiganRequest).Methods("GET")


	driver, err = neo4j.NewDriver(dbUri, neo4j.BasicAuth(dbUser, dbPassword, ""))
	if err != nil {
		log.Fatal(err)
		return
	} else {
		log.Printf("Driver Connected %s", driver.Target().Host)

	}
	defer driver.Close()

	handler := cors.Default().Handler(rtr)

	err = http.ListenAndServe(":"+port, handler)
	if err != nil {
		log.Fatal(err)
		return
	}
}

package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/olivere/elastic"
	"log"
	"net/http"
	"os"
	"regexp"
	"time"
)

type Gene struct {
	Entrez int    `json:"entrez"`
	Symbol string `json:"official_symbol"`
}

type Phenotype struct {
	OMIM int      `json:"omim"`
	Name []string `json:"name"`
}

var (
	elasticClient *elastic.Client
	r             *gin.Engine
)

var IS_NUMBER = regexp.MustCompile(`^[0-9]+$`)

func mu(a ...interface{}) []interface{} {
	return a
}

func errorResponse(c *gin.Context, code int, err string) {
	c.JSON(code, gin.H{
		"error": err,
	})
}

func searchPhenotype(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		errorResponse(c, http.StatusBadRequest, "Query not specified")
		return
	}

	var esQuery elastic.Query
	if (IS_NUMBER.MatchString(query)) {
		esQuery = elastic.NewBoolQuery().Should(
			elastic.NewMatchQuery("omim", query).Boost(10),
			elastic.NewMultiMatchQuery(query, "name").
				Fuzziness("2")).
			MinimumNumberShouldMatch(1)

	} else {
		esQuery =
			elastic.NewMultiMatchQuery(query, "name").
				Fuzziness("1")
	}

	result, err := elasticClient.Search("phenotype").Query(esQuery).
		Do(c.Request.Context())

	if err != nil {
		log.Println(err)
	}
	docs := make([]Phenotype, 0)

	for _, hit := range result.Hits.Hits {
		var doc Phenotype
		json.Unmarshal(*hit.Source, &doc)
		docs = append(docs, doc)
	}
	c.JSON(http.StatusOK, docs)
}

func searchGene(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		errorResponse(c, http.StatusBadRequest, "Query not specified")
		return
	}

	var esQuery elastic.Query
	if (IS_NUMBER.MatchString(query)) {
		esQuery = elastic.NewBoolQuery().Should(
			elastic.NewMatchQuery("entrez", query).Boost(10),
			elastic.NewMultiMatchQuery(query, "official_symbol").
				Fuzziness("1")).
			MinimumNumberShouldMatch(1)

	} else {
		esQuery =
			elastic.NewMultiMatchQuery(query, "official_symbol").
				Fuzziness("1")
	}

	result, err := elasticClient.Search("gene").Query(esQuery).
		Do(c.Request.Context())

	if err != nil {
		log.Println(err)
	}
	docs := make([]Gene, 0)

	for _, hit := range result.Hits.Hits {
		var doc Gene
		json.Unmarshal(*hit.Source, &doc)
		docs = append(docs, doc)
	}
	c.JSON(http.StatusOK, docs)
}

func CORSMiddleware(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()

}


func main() {

	path := os.Getenv("HTTP_ROOT")



	var err error
	elasticSearchHost := os.Getenv("ELASTICSEARCH_HOSTNAME")
	elasticSearchPort := os.Getenv("ELASTICSEARCH_PORT")
	if elasticSearchPort == "" {
		elasticSearchPort = "9200"
	}

	for {
		elasticClient, err = elastic.NewClient(
			elastic.SetURL(fmt.Sprintf("http://%s:%s", elasticSearchHost, elasticSearchPort)),
			elastic.SetSniff(false),
		)
		if err != nil {
			log.Println(err)
			time.Sleep(3 * time.Second)
		} else {
			break
		}
	}

	gin.DisableConsoleColor()

	gin.SetMode(gin.ReleaseMode)

	r = gin.Default()

	r.GET(path+"/gene", CORSMiddleware, searchGene)
	r.GET(path+"/phenotype", CORSMiddleware, searchPhenotype)

	err = r.Run()
	if err != nil {
		log.Println(err)
	}
}

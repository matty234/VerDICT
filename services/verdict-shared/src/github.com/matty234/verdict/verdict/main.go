package verdict

type Phenotype struct {
	Omim  int64    `json:"omim"`
	Name  []string `json:"name"`
	Score float64  `json:"score,omitempty"`
}

type Gene struct {
	Entrez         int64   `json:"entrez"`
	OfficialSymbol string  `json:"official_symbol"`
	Score          float64 `json:"score,omitempty"`
}

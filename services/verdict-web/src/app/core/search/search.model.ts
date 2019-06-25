import { Gene } from '../../directory/gene/gene.model';
import { KegResponse } from '../../directory/gene/pathways/pathways.model';
import { Phenotype } from '../../directory/phenotype/phenotype.model';
import { SearchIDs } from './search-bar/search-bar.component';

export type SearchResult = ((Partial<Phenotype> & Partial<Gene>) | Partial<KegResponse>) & {type: SearchIDs};
export type SearchResults = SearchResult[];

from app import store


def test_corpus_index_is_a_small_picker_list(client):
    index = client.get('/api/corpus/index').json()
    assert len(index) == len(store.regulations())
    entry = next(item for item in index if item['id'] == 'uu-25-2009')
    assert entry['label'] == 'UU 25/2009' and entry['articles'] > 0 and len(entry['title']) <= 90
    assert set(entry) == {'id', 'label', 'title', 'articles'}


def test_article_search_names_the_regulation(client):
    results = client.get('/api/search?q=pelayanan&limit=5').json()['results']
    assert results and all(r['regulation_title'] for r in results)
    assert client.get('/api/search?q=pelayanan&limit=61').status_code == 422


def test_document_search_ignores_filler_words_and_ranks_exact_numbers_first(client):
    best = client.get('/api/data/documents?q=UU 25 tahun 2009&sort=relevance').json()
    assert best['items'][0]['id'] == 'uu-25-2009'
    assert client.get('/api/data/documents?q=uu nomor 25/2009&sort=relevance').json()['items'][0]['id'] == 'uu-25-2009'

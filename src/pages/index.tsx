import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // AXIOS REQUEST WITH PARAM
    async (params = null) => {
      const { pageParam } = params;
      
      const { data } = await api.get('/api/images', { params: { after: pageParam } });
      // console.log(data, params);
      
      return data;
    },
    
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: (data) => data.after,
    }
  );

  // FORMAT AND FLAT DATA ARRAY
  const formattedData = useMemo(() => {
    let dataArray = data?.pages.map(page => {
      return page.data;
    })

    dataArray = dataArray?.flat();

    return dataArray;
  }, [data]);
  
  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        {formattedData ? <CardList cards={formattedData} /> : ''}
        {/* RENDER LOADING SCREEN */}
        { isLoading && <Loading /> }
        {/* RENDER ERROR SCREEN */}
        { isError && <Error /> }
        {/* RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && <Button mt={8} onClick={() => fetchNextPage()}>{ isFetchingNextPage ? "Carregando..." : "Carregar mais"}</Button>}
      </Box>
    </>
  );
}

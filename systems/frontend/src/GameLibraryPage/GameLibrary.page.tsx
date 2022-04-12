import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';

import { AddGameLibraryFormDialog } from './AddGameLibrary.form';
import GameListProvider, { Game, useGameList } from './GameList.provider';

function GameLibraryListItem({ game }: { game: Game }) {
  return (
    <Stack
      alignItems={'center'}
      component={'li'}
      direction={'row'}
      justifyContent={'space-between'}
      sx={{
        ':hover': {
          backgroundColor: 'grey.400',
          border: '1px solid',
          borderColor: 'primary.main',
        },
        backgroundColor: 'background.default',
        borderRadius: '1rem',
        height: '10.4rem',
        listStyleType: 'none',
        overflow: 'hidden',
        pr: 2,
      }}
    >
      <Stack alignItems={'center'} direction={'row'}>
        <Box
          component={'img'}
          src={game.boxArtImageUrl}
          sx={{
            height: 1,
            objectFit: 'fill',
            width: '8rem',
          }}
        />
        <Stack spacing={1} sx={{ ml: 2, width: '16rem' }}>
          <Typography
            sx={{
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {game.name}
          </Typography>
          <Chip
            label={game.platform}
            sx={{
              textTransform: 'uppercase',
            }}
          />
        </Stack>
      </Stack>

      <Box
        sx={{
          display: { sm: 'block', xs: 'none' },
        }}
      >
        <Chip
          label={game.publisher}
          sx={{
            textTransform: 'uppercase',
            width: '16rem',
          }}
        />
      </Box>
    </Stack>
  );
}

function GameLibraryFilter() {
  const { platformFilter, setFilter } = useGameList();
  return (
    <Stack>
      <Typography variant={'h3'}>Filter</Typography>
      <RadioGroup onChange={setFilter} value={platformFilter}>
        <FormControlLabel
          control={<Radio color="default" />}
          label="PS4"
          value="PS4"
        />
        <FormControlLabel
          control={<Radio color="default" />}
          label="PS5"
          value="PS5"
        />
        <FormControlLabel
          control={<Radio color="default" />}
          label="ALL"
          value="ALL"
        />
      </RadioGroup>
    </Stack>
  );
}

function GameLibraryList() {
  const { currentPage, data, error, loading, setPage, totalPage } =
    useGameList();

  const records = useMemo(() => {
    if (loading || error || !data) return [];
    return data.gameList.edges.map(edge => edge.node);
  }, [data, error, loading]);
  return (
    <>
      <Stack
        component={'ul'}
        spacing={2}
        sx={{
          m: 0,
          mr: 2,
          p: 0,
        }}
      >
        {records.map(record => (
          <GameLibraryListItem game={record} key={record.id} />
        ))}
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'center'}
        sx={{
          mb: 2,
          mt: 2,
        }}
      >
        <Pagination count={totalPage} onChange={setPage} page={currentPage} />
      </Stack>
    </>
  );
}

function GameListHeading() {
  const { data, error, loading, platformFilter, variables } = useGameList();
  const { from, to, totalCount } = useMemo(() => {
    if (loading || error || !data || !variables)
      return { from: 0, to: 0, totalCount: 0 };
    const offset = variables?.offset;
    const totalCount = data.gameList.totalCount;
    return {
      from: totalCount > 0 ? offset + 1 : 0,
      to: offset + data.gameList.edges.length,
      totalCount: totalCount,
    };
  }, [data, error, loading, variables]);
  return (
    <Typography
      sx={{
        mb: 3,
        mt: 0,
      }}
      variant={'h4'}
    >
      {totalCount === 0
        ? `Click Add Game to your library for add record to ${platformFilter} platform`
        : `Saved ( ${from} - ${to} of ${totalCount}) on ${platformFilter} platform`}
    </Typography>
  );
}

export default function GameLibraryPage() {
  return (
    <Paper
      sx={{ minHeight: '100%', pt: 2, px: { lg: 8, md: 4, sm: 2, xs: 1 } }}
    >
      <GameListProvider>
        <Grid container>
          <Grid item md={8} xs={10}>
            <GameListHeading />
          </Grid>
          <Grid item md={4} xs={2}>
            <Stack
              sx={{
                mt: 1,
              }}
            >
              <AddGameLibraryFormDialog />
            </Stack>
          </Grid>
          <Grid item md={8} xs={10}>
            <GameLibraryList />
          </Grid>
          <Grid item md={4} xs={2}>
            <GameLibraryFilter />
          </Grid>
        </Grid>
      </GameListProvider>
    </Paper>
  );
}

# SOURCES — re-fetch manifest for removed raw data

These large **raw, public, re-downloadable** datasets were removed locally on **2026-06-28**
to reclaim disk space. They are NOT in git (too large / gitignored) — re-fetch from the
authoritative sources below. Derived/own work was preserved, not deleted.

## Sources (worldbeachtour/data — all public)
| Dataset | Provider / portal |
|---|---|
| WDPA `WDPA_Apr2026_Public` (protected areas) | Protected Planet — https://www.protectedplanet.net/en (WDPA, April 2026 release) |
| EOT20 ocean tide model (`eot20.zip`, `ocean_tides`) | SEANOE — https://doi.org/10.17882/79489 (EOT20) |
| WorldClim 2.1 (`wc2.1_2.5m_*`) | https://www.worldclim.org/data/worldclim21.html |
| GloPrSM v1.0.0 (global predicted sand mineralogy) | Research dataset — search "GloPrSM v1.0.0" (provider portal; verify before refetch) |
| GMW v3 2020 (Global Mangrove Watch) | https://www.globalmangrovewatch.org/ (also Zenodo) |
| ETOPO 2022 60s relief (`ETOPO_2022_v1_60s.nc`) | NOAA NCEI — https://www.ncei.noaa.gov/products/etopo-global-relief-model |
| IBTrACS v04r01 (cyclone tracks) | NOAA NCEI — https://www.ncei.noaa.gov/products/international-best-track-archive |
| GeoNames `allCountries.zip` | https://download.geonames.org/export/dump/allCountries.zip |

## Removed manifest (147 files, 21.1 GB)

- `data/sand/glopsrm/GloPrSM_v1.0.0.zip` — 2855 MB
- `data/wdpa/part1/WDPA_Apr2026_Public_shp-polygons.shp` — 2311 MB
- `data/eot20/eot20.zip` — 2223 MB
- `data/wdpa/part2/WDPA_Apr2026_Public_shp-polygons.shp` — 1645 MB
- `data/wdpa/part0/WDPA_Apr2026_Public_shp-polygons.shp` — 1593 MB
- `data/eot20/ocean_tides.zip` — 1151 MB
- `data/gmw/gmw_v3_2020_vec.shp` — 853 MB
- `data/etopo/ETOPO_2022_v1_60s.nc` — 456 MB
- `data/worldclim/wc2.1_2.5m_tmin.zip` — 430 MB
- `data/worldclim/wc2.1_2.5m_tmax.zip` — 424 MB
- `data/worldclim/wc2.1_2.5m_tavg.zip` — 423 MB
- `data/allCountries.zip` — 398 MB
- `data/ibtracs/ibtracs.ALL.list.v04r01.csv` — 315 MB
- `data/wdpa/part2/WDPA_Apr2026_Public_shp-polygons.dbf` — 286 MB
- `data/wdpa/part1/WDPA_Apr2026_Public_shp-polygons.dbf` — 272 MB
- `data/wdpa/part0/WDPA_Apr2026_Public_shp-polygons.dbf` — 259 MB
- `data/worldclim/wc2.1_2.5m_srad.zip` — 212 MB
- `data/worldclim/wc2.1_2.5m_wind.zip` — 211 MB
- `data/gmw/gmw_v3_2020_vec.zip` — 176 MB
- `data/wdpa/csv/WDPA_Apr2026_Public_csv.csv` — 145 MB
- `data/eot20/ocean_tides/ocean_tides/2N2_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/SSA_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/J1_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/K1_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/K2_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/M2_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/M4_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/MF_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/MM_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/N2_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/O1_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/P1_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/Q1_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/S1_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/S2_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/SA_ocean_eot20.nc` — 127 MB
- `data/eot20/ocean_tides/ocean_tides/T2_ocean_eot20.nc` — 127 MB
- `data/worldclim/wc2.1_2.5m_prec.zip` — 68 MB
- `data/sand/glopsrm/IJ_QFL/F_i95.tif` — 68 MB
- `data/sand/glopsrm/unpacked/Data/IJ_QFL/F_i95.tif` — 68 MB
- `data/sand/glopsrm/IJ_QFL/L_i95.tif` — 68 MB
- `data/sand/glopsrm/unpacked/Data/IJ_QFL/L_i95.tif` — 68 MB
- `data/sand/glopsrm/IJ_QFL/F_med.tif` — 68 MB
- `data/sand/glopsrm/unpacked/Data/IJ_QFL/F_med.tif` — 68 MB
- `data/sand/glopsrm/IJ_QFL/L_med.tif` — 68 MB
- `data/sand/glopsrm/unpacked/Data/IJ_QFL/L_med.tif` — 68 MB
- `data/sand/glopsrm/IJ_QFL/Q_i95.tif` — 68 MB
- `data/sand/glopsrm/unpacked/Data/IJ_QFL/Q_i95.tif` — 68 MB
- `data/sand/glopsrm/IJ_QFL/Q_med.tif` — 68 MB
- `data/sand/glopsrm/unpacked/Data/IJ_QFL/Q_med.tif` — 68 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_03.tif` — 38 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_05.tif` — 38 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_09.tif` — 38 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_04.tif` — 38 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_06.tif` — 38 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_10.tif` — 38 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_03.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_02.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_11.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_01.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_07.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_12.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_05.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_04.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_03.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_05.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmin_08.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_04.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_02.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_06.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_06.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_02.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_07.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_01.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_10.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_10.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_11.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_01.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_11.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_07.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_09.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_08.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_09.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_12.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tmax_12.tif` — 37 MB
- `data/worldclim/tifs/wc2.1_2.5m_tavg_08.tif` — 36 MB
- `data/overture_beaches.json` — 31 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_02.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_03.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_09.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_10.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_01.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_02.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_12.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_11.tif` — 19 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_01.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_03.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_12.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_04.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_11.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_09.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_10.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_05.tif` — 18 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_06.tif` — 17 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_07.tif` — 17 MB
- `data/worldclim/tifs/wc2.1_2.5m_wind_08.tif` — 17 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_04.tif` — 17 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_08.tif` — 16 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_05.tif` — 15 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_07.tif` — 15 MB
- `data/worldclim/tifs/wc2.1_2.5m_srad_06.tif` — 15 MB
- `data/airports.csv` — 12 MB
- `data/gmw/gmw_v3_2020_vec.dbf` — 10 MB
- `data/gmw/gmw_v3_2020_vec.shx` — 8 MB
- `data/wikidata_beaches.json` — 7 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_08.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_10.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_07.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_09.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_06.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_03.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_04.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_05.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_11.tif` — 6 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_02.tif` — 5 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_12.tif` — 5 MB
- `data/worldclim/tifs/wc2.1_2.5m_prec_01.tif` — 5 MB
- `data/eea_bathing_water.json` — 5 MB
- `data/wdpa/part0/WDPA_Apr2026_Public_shp-polygons.shx` — 1 MB
- `data/wdpa/part1/WDPA_Apr2026_Public_shp-polygons.shx` — 1 MB
- `data/wdpa/part2/WDPA_Apr2026_Public_shp-polygons.shx` — 1 MB
- `data/eea_quality_2024.json` — 1 MB
- `data/wikipedia_beaches.json` — 1 MB
- `data/wdpa/csv/WDPA_sources_Apr2026.csv` — 0 MB
- `data/sand_curated.yaml` — 0 MB
- `data/eot20/ocean_tides/__MACOSX/ocean_tides/._K2_ocean_eot20.nc` — 0 MB
- `data/worldclim/tifs/readme.txt` — 0 MB
- `data/gmw/gmw_v3_2020_vec.prj` — 0 MB
- `data/wdpa/part0/WDPA_Apr2026_Public_shp-polygons.prj` — 0 MB
- `data/wdpa/part1/WDPA_Apr2026_Public_shp-polygons.prj` — 0 MB
- `data/wdpa/part2/WDPA_Apr2026_Public_shp-polygons.prj` — 0 MB
- `data/wdpa/part0/WDPA_Apr2026_Public_shp-polygons.cpg` — 0 MB
- `data/wdpa/part1/WDPA_Apr2026_Public_shp-polygons.cpg` — 0 MB
- `data/wdpa/part2/WDPA_Apr2026_Public_shp-polygons.cpg` — 0 MB
- `data/blue_flag_beaches.json` — 0 MB
- `data/epa_beacon.json` — 0 MB
- `data/beaches.db` — 0 MB


    const TARGET_PHONE_DISPLAY = "+380989749954";

    // Inline SVG path data for the four cargo-type icons chosen dynamically
    // at render time (see getCargoIconConfig). Icons are embedded directly
    // rather than swapped in at runtime by an icon-library script, so there
    // is no extra library to load, no DOM scan to run on every render, and
    // no dependency on a CDN being reachable.
    const ICON_SVGS = {
      droplet: '<use href="#i-droplet"/>',
      wheat: '<use href="#i-wheat"/>',
      layers: '<use href="#i-layers"/>',
      package: '<use href="#i-package"/>'
    };

    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function escAttr(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function formatDate(dateStr) {
      if (!dateStr) return 'За домовленістю';
      try {
        const parts = String(dateStr).split('T')[0].split('-');
        if (parts.length === 3) {
          const [year, month, day] = parts;
          return `${day}/${month}/${year}`;
        }
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (e) {
        return String(dateStr);
      }
    }

    function getUrgencyBadge(loadingDateStr) {
      if (!loadingDateStr) return null;
      const today = new Date();
      const formatIso = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };
      const todayStr = formatIso(today);
      const tomorrowStr = formatIso(new Date(today.getTime() + 86400000));
      const targetStr = String(loadingDateStr).split('T')[0];

      if (targetStr === todayStr) {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">⚡ Сьогодні</span>';
      }
      if (targetStr === tomorrowStr) {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">⚡ Завтра</span>';
      }
      return null;
    }

    function generateLiveDemoData() {
      const now = new Date();
      const formatIso = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      return [
        {
          id: "demo-1",
          truck_type: "Тент 86–92м³",
          trucks_count: 2,
          product: "Шрот соєвий (біг-беги)",
          weight: "22 т / 86 м³",
          loading_location: "м. Вінниця (UA)",
          unloading_location: "м. Хелм (PL)",
          loading_date: formatIso(new Date(now.getTime() + 86400000)),
          payment_terms: "5 б.д. по сканах CMR",
          contact_phone: "+380989749954",
          customs_clearance_out: "Вінницька митниця",
          customs_clearance_in: "Дорогуськ (PL)",
          price: "1 250 EUR",
          notes: "Потрібно 2 авто. Верхнє/бокове завантаження.",
          status: "active",
          created_at: now.toISOString()
        },
        {
          id: "demo-2",
          truck_type: "Зерновоз (самоскид)",
          trucks_count: 3,
          product: "Кукурудза фуражна (насип)",
          weight: "24 т",
          loading_location: "м. Тернопіль (UA)",
          unloading_location: "порт Гданськ (PL)",
          loading_date: formatIso(now),
          payment_terms: "По вивантаженню (ТТН)",
          contact_phone: "+380989749954",
          customs_clearance_out: "Тернопільська митниця",
          customs_clearance_in: "Гданськ термінал",
          price: "42 EUR/т",
          notes: "Потрібно 3 зерновози з клапан-дверима. Прямий контракт.",
          status: "active",
          created_at: now.toISOString()
        },
        {
          id: "demo-3",
          truck_type: "Автоцистерна (харчова)",
          trucks_count: 1,
          product: "Олія соняшникова",
          weight: "22.5 т",
          loading_location: "м. Полтава (UA)",
          unloading_location: "м. Клайпеда (LT)",
          loading_date: formatIso(new Date(now.getTime() + 86400000 * 2)),
          payment_terms: "50% / 50% по CMR",
          contact_phone: "+380989749954",
          customs_clearance_out: "Полтава ВМО",
          customs_clearance_in: "Клайпеда порт",
          price: "Запит ціни",
          notes: "Ізотермічна цистерна з підігрівом, 3-4 секції.",
          status: "active",
          created_at: now.toISOString()
        }
      ];
    }

    function getCargoIconConfig(productStr, truckStr) {
      const p = (productStr || '').toLowerCase();
      const t = (truckStr || '').toLowerCase();

      if (p.includes('олі') || p.includes('масло') || t.includes('цистерн')) {
        return {
          svg: ICON_SVGS.droplet,
          bg: 'bg-amber-500/10 dark:bg-amber-500/15',
          text: 'text-amber-600 dark:text-amber-400'
        };
      }
      if (p.includes('кукурудз') || p.includes('зерн') || p.includes('пшениц') || p.includes('соя') || t.includes('зерновоз') || t.includes('самоскид')) {
        return {
          svg: ICON_SVGS.wheat,
          bg: 'bg-yellow-500/10 dark:bg-yellow-500/15',
          text: 'text-yellow-600 dark:text-yellow-400'
        };
      }
      if (p.includes('палет') || p.includes('дріждж') || p.includes('мішк') || p.includes('біг-бег') || p.includes('шрот') || p.includes('макух') || p.includes('борошно')) {
        return {
          svg: ICON_SVGS.layers,
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          text: 'text-emerald-600 dark:text-emerald-400'
        };
      }
      return {
        svg: ICON_SVGS.package,
        bg: 'bg-orange-500/10 dark:bg-orange-500/15',
        text: 'text-orange-600 dark:text-orange-400'
      };
    }

    // Coordinates for the instant-paint placeholder estimate only (see
    // estimateDistanceFallbackKm below) - the real number always comes
    // from Google once resolveRealDistance() resolves.
    const CITY_COORDS = {
      'вінниця': [49.2331, 28.4682],
      'хелм': [51.1378, 23.4739],
      'тернопіль': [49.5535, 25.5948],
      'гданськ': [54.3520, 18.6466],
      'полтава': [49.5883, 34.5514],
      'клайпеда': [55.7033, 21.1443],
      'хмельницький': [49.4230, 26.9871],
      'люблін': [51.2465, 22.5684],
      'львів': [49.8397, 24.0297],
      'варшава': [52.2297, 21.0122],
      'київ': [50.4501, 30.5234],
      'одеса': [46.4825, 30.7233],
      'дніпро': [48.4647, 35.0462],
      'дорогоуськ': [51.1558, 23.8058],
      'дорогуськ': [51.1558, 23.8058],
      'краків': [50.0647, 19.9450],
      'вроцлав': [51.1079, 17.0385],
      'берлін': [52.5200, 13.4050]
    };

    function cleanCityName(str) {
      return (str || '').toLowerCase().replace(/^(м\.|порт|смт|с\.)\s*/i, '').replace(/\(.*?\)/g, '').trim();
    }

    // Instant-paint placeholder only: a straight-line estimate (×1.22 to
    // roughly account for roads not being straight) shown for a split
    // second while the real driving distance loads from Google below.
    // This used to be treated as the actual answer (including a hardcoded
    // table of a dozen specific city pairs) - that's what produced wrong
    // distances, since a straight line is never the real road distance.
    function estimateDistanceFallbackKm(loc1, loc2) {
      const getCoord = (s) => {
        const name = cleanCityName(s);
        for (const [city, coord] of Object.entries(CITY_COORDS)) {
          if (name.includes(city)) return coord;
        }
        return null;
      };
      const c1 = getCoord(loc1);
      const c2 = getCoord(loc2);
      if (!c1 || !c2) return null;

      const R = 6371;
      const dLat = (c2[0] - c1[0]) * Math.PI / 180;
      const dLon = (c2[1] - c1[1]) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return Math.round(R * c * 1.22);
    }

    // Real driving distance, sourced from Google Maps (Distance Matrix API)
    // through our own backend at /api/shipments?action=distance, so the
    // Google API key never has to be exposed in the browser. Results are
    // cached in localStorage (routes don't move) so a returning visitor
    // never re-pays the network round trip for a pair already looked up.
    const REAL_DISTANCE_STORE_KEY = 'logix_real_distances_v1';
    const distanceState = {}; // itemId -> { km, isReal }

    function loadRealDistanceStore() {
      try { return JSON.parse(localStorage.getItem(REAL_DISTANCE_STORE_KEY)) || {}; }
      catch { return {}; }
    }
    function saveRealDistanceKm(pairKey, km) {
      try {
        const store = loadRealDistanceStore();
        store[pairKey] = km;
        localStorage.setItem(REAL_DISTANCE_STORE_KEY, JSON.stringify(store));
      } catch { /* localStorage unavailable (private mode, quota) - safe to skip caching */ }
    }
    function distancePairKey(loc1, loc2) {
      return `${cleanCityName(loc1)}__${cleanCityName(loc2)}`;
    }

    function updateDistanceDom(itemId, km, isReal) {
      const text = km ? `${isReal ? '' : '~'}${km} км` : 'Автошлях';
      const safeId = (window.CSS && CSS.escape) ? CSS.escape(String(itemId)) : String(itemId).replace(/["\\]/g, '');
      document.querySelectorAll(`[data-distance-pill="${safeId}"]`).forEach(el => {
        el.textContent = km ? `🗺️ ${km} км` : '🗺️ —';
        el.title = isReal ? 'Точна відстань за дорогами (Google Maps)' : 'Орієнтовна відстань по прямій';
      });
      document.querySelectorAll(`[data-distance-info="${safeId}"]`).forEach(el => { el.textContent = text; });
    }

    async function resolveRealDistance(item) {
      const pairKey = distancePairKey(item.loading_location, item.unloading_location);
      const store = loadRealDistanceStore();
      if (store[pairKey]) {
        distanceState[item.id] = { km: store[pairKey], isReal: true };
        updateDistanceDom(item.id, store[pairKey], true);
        return;
      }

      // Two shipments can share the exact same route (e.g. two lots on
      // the same Vinnytsia -> Chelm lane) - dedupe so they share one
      // in-flight request instead of both hitting the API separately.
      if (!resolveRealDistance._inFlight) resolveRealDistance._inFlight = {};
      if (!resolveRealDistance._inFlight[pairKey]) {
        resolveRealDistance._inFlight[pairKey] = (async () => {
          try {
            const url = `/api/shipments?action=distance&origin=${encodeURIComponent(item.loading_location)}&destination=${encodeURIComponent(item.unloading_location)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.available && data.km) {
              saveRealDistanceKm(pairKey, data.km);
              return data.km;
            }
            return null;
          } catch {
            return null;
          } finally {
            delete resolveRealDistance._inFlight[pairKey];
          }
        })();
      }

      const km = await resolveRealDistance._inFlight[pairKey];
      if (km) {
        distanceState[item.id] = { km, isReal: true };
        updateDistanceDom(item.id, km, true);
      }
      // If Google has no route for this pair (km === null), we simply
      // keep showing the straight-line estimate already on screen rather
      // than overwriting it with nothing.
    }


    function openRouteMapModal(origin, destination, itemId) {
      const cleanOrigin = cleanCityName(origin);
      const cleanDestination = cleanCityName(destination);
      const known = distanceState[itemId];

      document.getElementById('mapModalRouteTitle').innerText = `${origin} ➔ ${destination}`;
      document.getElementById('mapModalDistanceSubtitle').innerText = known && known.km
        ? (known.isReal ? `Відстань за маршрутом: ${known.km} км` : `Орієнтовна відстань: ~${known.km} км`)
        : 'Автомобільний маршрут';

      const embedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(cleanOrigin)}&daddr=${encodeURIComponent(cleanDestination)}&hl=uk&output=embed`;
      document.getElementById('googleMapsIframe').src = embedUrl;

      const gMapsDirectUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(cleanOrigin)}&destination=${encodeURIComponent(cleanDestination)}&travelmode=driving`;
      document.getElementById('mapModalGoogleMapsDirect').href = gMapsDirectUrl;

      document.getElementById('mapModal').classList.remove('hidden');
    }

    function closeMapModal() {
      document.getElementById('mapModal').classList.add('hidden');
      document.getElementById('googleMapsIframe').src = '';
    }

    function openStickerModal(id) {
      const item = shipmentsData.find(s => String(s.id) === String(id));
      if (!item) return;

      // Стікер малюється в тій темі (світла/темна), в якій зараз працює користувач.
      const isDark = document.documentElement.classList.contains('dark');
      const palette = isDark ? {
        gradFrom: '#1C1C1E', gradTo: '#000000', panelFill: 'rgba(255,255,255,0.05)', panelStroke: '#0A84FF',
        badgeFill: '#0A84FF', badgeText: '#ffffff', priceText: '#409CFF', labelText: '#98989D', valueText: '#FFFFFF',
        unloadingText: '#30D158', divider: 'rgba(255,255,255,0.14)', dateText: '#409CFF', footerFill: '#0A84FF',
        footerText: '#ffffff', canvasBg: '#000000'
      } : {
        gradFrom: '#FFFFFF', gradTo: '#F2F2F7', panelFill: 'rgba(120,120,128,0.06)', panelStroke: '#007AFF',
        badgeFill: '#007AFF', badgeText: '#ffffff', priceText: '#007AFF', labelText: '#6C6C70', valueText: '#000000',
        unloadingText: '#248A3D', divider: 'rgba(60,60,67,0.18)', dateText: '#007AFF', footerFill: '#007AFF',
        footerText: '#ffffff', canvasBg: '#FFFFFF'
      };

      const canvas = document.getElementById('stickerCanvas');
      canvas.style.backgroundColor = palette.canvasBg;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 600, 600);
      grad.addColorStop(0, palette.gradFrom);
      grad.addColorStop(1, palette.gradTo);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 600);

      ctx.fillStyle = palette.panelFill;
      ctx.strokeStyle = palette.panelStroke;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(30, 30, 540, 540, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = palette.badgeFill;
      ctx.beginPath();
      ctx.roundRect(50, 50, 220, 42, 12);
      ctx.fill();

      ctx.fillStyle = palette.badgeText;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🚚 ЗАЯВКА НА АВТО', 68, 77);

      ctx.fillStyle = palette.priceText;
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(item.price || 'Договірна', 540, 78);
      ctx.textAlign = 'left';

      ctx.fillStyle = palette.labelText;
      ctx.font = '14px sans-serif';
      ctx.fillText('ЗАВАНТАЖЕННЯ:', 55, 140);
      ctx.fillStyle = palette.valueText;
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(item.loading_location || '', 55, 170);

      ctx.fillStyle = palette.labelText;
      ctx.font = '14px sans-serif';
      ctx.fillText('РОЗВАНТАЖЕННЯ:', 55, 220);
      ctx.fillStyle = palette.unloadingText;
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(item.unloading_location || '', 55, 250);

      ctx.strokeStyle = palette.divider;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(55, 285);
      ctx.lineTo(545, 285);
      ctx.stroke();

      ctx.fillStyle = palette.labelText;
      ctx.font = '16px sans-serif';
      ctx.fillText('📦 Вантаж:', 55, 325);
      ctx.fillStyle = palette.valueText;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${item.product || ''} (${item.weight || ''})`, 170, 325);

      ctx.fillStyle = palette.labelText;
      ctx.font = '16px sans-serif';
      ctx.fillText('🚛 Транспорт:', 55, 365);
      ctx.fillStyle = palette.valueText;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${item.truck_type || ''} ${item.trucks_count > 1 ? `(${item.trucks_count} авто)` : ''}`, 170, 365);

      ctx.fillStyle = palette.labelText;
      ctx.font = '16px sans-serif';
      ctx.fillText('📅 Дата зав.:', 55, 405);
      ctx.fillStyle = palette.dateText;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(formatDate(item.loading_date), 170, 405);

      ctx.fillStyle = palette.labelText;
      ctx.font = '16px sans-serif';
      ctx.fillText('💳 Оплата:', 55, 445);
      ctx.fillStyle = palette.valueText;
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(item.payment_terms || 'По сканах CMR', 170, 445);

      ctx.fillStyle = palette.footerFill;
      ctx.beginPath();
      ctx.roundRect(55, 480, 490, 60, 16);
      ctx.fill();

      ctx.fillStyle = palette.footerText;
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`📞 Диспетчер: ${item.contact_phone || '+380989749954'}`, 300, 517);
      ctx.textAlign = 'left';

      document.getElementById('stickerModal').classList.remove('hidden');
    }

    function closeStickerModal() {
      document.getElementById('stickerModal').classList.add('hidden');
    }

    function downloadStickerImage() {
      const canvas = document.getElementById('stickerCanvas');
      const link = document.createElement('a');
      link.download = `zayavka-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Зображення збережено!');
    }

    function showToast(msg, isError = false) {
      const toast = document.getElementById('appleToast');
      const icon = document.getElementById('toastIcon');
      document.getElementById('toastMessage').innerText = msg;

      if (isError) {
        icon.className = 'w-4 h-4 text-rose-500';
      } else {
        icon.className = 'w-4 h-4 text-emerald-500';
      }

      toast.classList.remove('opacity-0', '-translate-y-8');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', '-translate-y-8');
      }, 2400);
    }

    function initTheme() {
      const savedTheme = localStorage.getItem('logix_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(savedTheme);
    }

    function toggleTheme() {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    }

    function setTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('themeColorMeta').setAttribute('content', '#000000');
      } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('themeColorMeta').setAttribute('content', '#F2F2F7');
      }
      localStorage.setItem('logix_theme', theme);
    }

    // State Variables
    let shipmentsData = [];
    let isInitialized = false;
    let currentTab = 'active';
    let selectedVehicleChip = 'all';
    let selectedUrgency = 'all';
    let bookmarks = JSON.parse(localStorage.getItem('logix_bookmarks') || '[]');
    let isAdminActive = false;
    let savedAdminKey = localStorage.getItem('logix_admin_pass') || '';
    let currentDataSource = 'supabase';

    if (savedAdminKey) {
      isAdminActive = true;
      syncAdminStateUI();
    }

    function updateDataSourceUI(sourceType) {
      currentDataSource = sourceType;
      const dot = document.getElementById('dataSourceDot');
      const text = document.getElementById('dataSourceText');

      if (sourceType === 'supabase') {
        dot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
        text.innerText = 'Supabase LIVE';
        text.className = 'text-emerald-700 dark:text-emerald-400 font-bold';
      } else {
        dot.className = 'w-2 h-2 rounded-full bg-amber-400';
        text.innerText = 'Демо-режим';
        text.className = 'text-amber-700 dark:text-amber-400 font-bold';
      }
    }

    async function fetchShipments() {
      try {
        const response = await fetch('/api/shipments');
        const dataSource = response.headers.get('X-Data-Source') || 'local_demo';
        updateDataSourceUI(dataSource);

        if (response.ok) {
          const fetchedData = await response.json();
          // If Supabase is connected, accept whatever array it returns (even empty)
          if (dataSource === 'supabase') {
            shipmentsData = Array.isArray(fetchedData) ? fetchedData : [];
          } else {
            // In demo mode, only fallback if completely uninitialized
            if (!isInitialized) {
              shipmentsData = Array.isArray(fetchedData) && fetchedData.length > 0 ? fetchedData : generateLiveDemoData();
            }
          }
        } else {
          if (!isInitialized) {
            shipmentsData = generateLiveDemoData();
          }
        }
      } catch (err) {
        updateDataSourceUI('local_demo');
        if (!isInitialized) {
          shipmentsData = generateLiveDemoData();
        }
      }
      isInitialized = true;
      applyFilters();
    }

    function setMainTab(tab) {
      currentTab = tab;
      const ids = { all: 'tab-all', active: 'tab-searching', completed: 'tab-confirmed', bookmarks: 'tab-bookmarks' };
      Object.entries(ids).forEach(([key, id]) => {
        document.getElementById(id).classList.toggle('chip-active', key === tab);
      });
      applyFilters();
    }

    function setVehicleTypeChip(type) {
      selectedVehicleChip = type;
      ['all', 'тент', 'зерновоз', 'цистерна'].forEach(t => {
        const el = document.getElementById(`chip-v-${t}`);
        if (el) {
          if (t === type) el.classList.add('chip-active');
          else el.classList.remove('chip-active');
        }
      });
      applyFilters();
    }

    function setUrgencyFilter(urgency) {
      selectedUrgency = urgency;
      const chipAll = document.getElementById('chip-u-all');
      const chipToday = document.getElementById('chip-u-today');
      
      if (urgency === 'all') {
        chipAll.classList.add('chip-active');
        chipToday.classList.remove('chip-active');
      } else {
        chipToday.classList.add('chip-active');
        chipAll.classList.remove('chip-active');
      }
      applyFilters();
    }

    function toggleBookmark(id) {
      if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(b => b !== id);
        showToast('Видалено з обраного');
      } else {
        bookmarks.push(id);
        showToast('Збережено в обране');
      }
      localStorage.setItem('logix_bookmarks', JSON.stringify(bookmarks));
      applyFilters();
    }

    function openNotificationModal() {
      const activeCount = shipmentsData.filter(x => x.status === 'active').length;
      document.getElementById('notificationList').innerHTML = `
        <div class="p-3 rounded-2xl inner-cell space-y-1">
          <div class="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>🟢 Актуальний фрахт</span>
            <span class="text-[10px] text-slate-500 font-normal">Щойно</span>
          </div>
          <p class="text-slate-600 dark:text-slate-400">На платформі доступно <b>${activeCount}</b> відкритих заявок на машини.</p>
        </div>
        <div class="p-3 rounded-2xl inner-cell space-y-1">
          <div class="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>⚡ Прямий зв'язок</span>
            <span class="text-[10px] text-slate-500 font-normal">Сьогодні</span>
          </div>
          <p class="text-slate-600 dark:text-slate-400">Швидкі пропозиції авто доступні через дзвінок, Viber та WhatsApp за номером +380989749954.</p>
        </div>
      `;
      document.getElementById('notificationModal').classList.remove('hidden');
    }

    function closeNotificationModal() {
      document.getElementById('notificationModal').classList.add('hidden');
    }

    let searchDebounceTimer = null;
    function onSearchInputDebounced() {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        applyFilters();
      }, 150);
    }

    function applyFilters() {
      const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();

      const activeList = shipmentsData.filter(x => x.status === 'active');
      const completedList = shipmentsData.filter(x => x.status === 'completed');

      document.getElementById('countAll').innerText = shipmentsData.length;
      document.getElementById('activeCountBadge').innerText = activeList.length;
      document.getElementById('completedCountBadge').innerText = completedList.length;

      let currentDataset;
      if (currentTab === 'bookmarks') {
        currentDataset = shipmentsData.filter(x => bookmarks.includes(String(x.id)));
      } else if (currentTab === 'active') {
        currentDataset = activeList;
      } else if (currentTab === 'completed') {
        currentDataset = completedList;
      } else {
        currentDataset = shipmentsData;
      }

      const today = new Date();
      const formatIso = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const todayStr = formatIso(today);
      const tomorrowStr = formatIso(new Date(today.getTime() + 86400000));

      const filtered = currentDataset.filter(item => {
        const matchesQuery = !query || 
          (item.truck_type && item.truck_type.toLowerCase().includes(query)) ||
          (item.product && item.product.toLowerCase().includes(query)) ||
          (item.loading_location && item.loading_location.toLowerCase().includes(query)) ||
          (item.unloading_location && item.unloading_location.toLowerCase().includes(query)) ||
          (item.payment_terms && item.payment_terms.toLowerCase().includes(query)) ||
          (item.notes && item.notes.toLowerCase().includes(query));

        const matchesVehicleChip = (selectedVehicleChip === 'all') || 
          (item.truck_type && item.truck_type.toLowerCase().includes(selectedVehicleChip));

        let matchesUrgency = true;
        if (selectedUrgency === 'today_tomorrow') {
          const lDate = String(item.loading_date || '').split('T')[0];
          matchesUrgency = (lDate === todayStr || lDate === tomorrowStr);
        }

        return matchesQuery && matchesVehicleChip && matchesUrgency;
      });

      filtered.sort((a, b) => new Date(a.loading_date || 0) - new Date(b.loading_date || 0));

      const hasActiveFilters = !!query || selectedVehicleChip !== 'all' || selectedUrgency !== 'all';
      renderList(filtered, { hasActiveFilters, isShowingBookmarks: currentTab === 'bookmarks', currentTab });
    }

    function resetFilters() {
      document.getElementById('searchInput').value = '';
      setVehicleTypeChip('all');
      setUrgencyFilter('all');
    }

    function renderList(list, context) {
      const container = document.getElementById('shipmentsContainer');
      if (!list || list.length === 0) {
        const ctx = context || {};
        let heading, sub, action = '';

        if (ctx.hasActiveFilters) {
          heading = 'Нічого не знайдено';
          sub = 'Жодна заявка не відповідає поточному пошуку чи фільтрам.';
          action = `<button onclick="resetFilters()" class="mt-1 px-4 py-2 rounded-xl text-xs font-bold btn-gradient-apple text-white active:scale-95">Скинути фільтри</button>`;
        } else if (ctx.isShowingBookmarks) {
          heading = 'Поки що порожньо';
          sub = 'Заявки, які ви збережете зіркою, з\u2019являться тут.';
        } else if (ctx.currentTab === 'completed') {
          heading = 'Закритих заявок ще немає';
          sub = 'Заявка потрапляє сюди тільки тоді, коли ви закриєте її вручну.';
        } else {
          heading = 'Активних заявок наразі немає';
          sub = isAdminActive
            ? 'Додайте перший рейс, натиснувши «Додати рейс» вгорі сторінки.'
            : 'Нові заявки з\u2019являються тут одразу, як тільки з\u2019являється фрахт.';
        }

        container.innerHTML = `
          <div class="col-span-full text-center py-16 apple-glass rounded-3xl border space-y-3">
            <svg class="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /> <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
            <div class="space-y-1">
              <p class="text-sm font-bold text-slate-800 dark:text-slate-200">${heading}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">${sub}</p>
            </div>
            ${action}
          </div>
        `;
        return;
      }

      const defaultCreatedDate = new Date().toISOString().split('T')[0];
      // Read the distance cache once per render, not once per card - with
      // a long list this used to mean re-parsing the same localStorage
      // blob dozens of times over.
      const realDistanceStore = loadRealDistanceStore();

      container.innerHTML = list.map(item => {
        const isActive = item.status === 'active';
        const isBookmarked = bookmarks.includes(String(item.id));
        const createdDateFormatted = formatDate(item.created_at || defaultCreatedDate);
        // Show whatever we already know instantly (a cached real distance
        // if we've resolved this pair before, otherwise a rough straight-
        // line placeholder) - resolveRealDistance() below fills in/updates
        // the true Google driving distance right after this paints.
        const cachedRealKm = realDistanceStore[distancePairKey(item.loading_location, item.unloading_location)];
        const distanceKm = cachedRealKm || estimateDistanceFallbackKm(item.loading_location, item.unloading_location);
        const distanceIsReal = Boolean(cachedRealKm);
        distanceState[item.id] = { km: distanceKm, isReal: distanceIsReal };
        const cargoCfg = getCargoIconConfig(item.product, item.truck_type);
        const count = item.trucks_count || 1;
        const isUrgent = isActive && !!getUrgencyBadge(item.loading_date);

        // Three-tier status system (all derived from real data: status +
        // how soon loading_date is): hot (urgent, needs a truck fast) >
        // searching (normal active) > confirmed (booked/closed).
        const tier = !isActive ? 'confirmed' : (isUrgent ? 'hot' : 'searching');
        const tierStyle = {
          hot: { card: 'card-hot', badge: 'badge-hot', ink: 'ink-hot', dot: 'dot-hot', ring: 'ring-hot', route: 'var(--rose)', label: '🔥 ГАРЯЧА ЗАЯВКА' },
          searching: { card: 'card-searching', badge: 'badge-searching', ink: 'ink-searching', dot: 'dot-searching', ring: 'ring-searching', route: 'var(--gold)', label: 'ШУКАЄМО АВТО' },
          confirmed: { card: 'card-confirmed', badge: 'badge-confirmed', ink: 'ink-confirmed', dot: 'dot-confirmed', ring: 'ring-confirmed', route: 'var(--emerald)', label: 'ЗАКРИТО' },
        }[tier];

        return `
          <div class="${tierStyle.card} shipment-card card-enter rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 relative group">

            <div class="space-y-4">

              <!-- 1. Top Row: Status Badge + Bookmark Star -->
              <div class="flex items-center justify-between gap-2">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border ${tierStyle.badge}">
                  ${tier === 'confirmed'
                    ? `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-check-circle"/></svg>`
                    : `<span class="w-2 h-2 rounded-full ${tierStyle.dot} ${tier === 'searching' ? 'pulse-dot' : ''}" style="--pulse-color: ${tierStyle.route}"></span>`}
                  ${tierStyle.label}

                  ${count > 1 ? `<span class="ml-1 pl-2 border-l opacity-90 ${tierStyle.badge}">${count} авто</span>` : ''}
                </div>

                <button onclick="toggleBookmark('${escAttr(item.id)}')" aria-label="Зберегти в обране" class="w-9 h-9 rounded-2xl inner-cell hover:opacity-80 active:scale-95 flex items-center justify-center transition-all shrink-0 ${isBookmarked ? 'text-amber-500 ring-2 ring-amber-500/30' : 'text-slate-500 dark:text-slate-400'}">
                  <svg class="w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-bookmark"/></svg>
                </button>
              </div>

              <!-- 2. Real route map preview: loading -> unloading -->
              <div class="space-y-2.5">
                <div class="route-preview" aria-label="Карта маршруту">
                  <iframe loading="lazy" title="Карта маршруту" data-route-src="https://maps.google.com/maps?saddr=${encodeURIComponent(item.loading_location || '')}&daddr=${encodeURIComponent(item.unloading_location || '')}&hl=uk&output=embed" class="skeleton-shimmer"></iframe>
                  <div class="route-pin route-pin-a"><span>A</span></div>
                  <div class="route-pin route-pin-b"><span>B</span></div>
                  <div class="route-label route-label-a" title="${escAttr(item.loading_location)}">${escapeHtml(item.loading_location)}</div>
                  <div class="route-label route-label-b" title="${escAttr(item.unloading_location)}">${escapeHtml(item.unloading_location)}</div>
                  <button type="button" class="route-expand" onclick="openRouteMapModal('${escAttr(item.loading_location)}', '${escAttr(item.unloading_location)}', '${escAttr(item.id)}')" aria-label="Відкрити карту маршруту">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-expand"/></svg>
                  </button>
                  <div class="route-distance" data-distance-pill="${escAttr(item.id)}" title="${distanceIsReal ? 'Точна відстань за дорогами (Google Maps)' : 'Орієнтовна відстань по прямій'}">🗺️ ${distanceIsReal ? '' : '~'}${distanceKm || '—'} км</div>
                </div>
                <div class="flex gap-3 relative px-1 pt-1">
                  <div class="flex flex-col items-center"><div class="w-4 h-4 rounded-full ${tierStyle.dot} ring-4 ${tierStyle.ring} flex items-center justify-center shrink-0"><div class="w-1.5 h-1.5 rounded-full bg-white"></div></div><div class="route-line w-[3px] flex-1 min-h-[24px] my-1 rounded-full opacity-70" style="--route-color:${tierStyle.route}"></div><div class="w-4 h-4 rounded-full ${tierStyle.dot} ring-4 ${tierStyle.ring} flex items-center justify-center shrink-0"><div class="w-1.5 h-1.5 rounded-full bg-white"></div></div></div>
                  <div class="flex-1 space-y-2"><div><div class="text-[10px] font-bold uppercase ${tierStyle.ink} tracking-wider">Завантаження</div><div class="text-[15px] font-bold text-slate-950 dark:text-white leading-tight">${escapeHtml(item.loading_location)}</div></div><div><div class="text-[10px] font-bold uppercase ${tierStyle.ink} tracking-wider">Розвантаження</div><div class="text-[15px] font-bold text-slate-950 dark:text-slate-100 leading-tight">${escapeHtml(item.unloading_location)}</div></div></div>
                </div>
                <div class="route-info relative flex items-center justify-between text-[11px] px-3 py-2"><div class="flex items-center gap-1.5"><svg class="w-4 h-4 route-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-ruler"/></svg><span>Відстань: <b data-distance-info="${escAttr(item.id)}">${distanceKm ? `${distanceIsReal ? '' : '~'}${distanceKm} км` : 'Автошлях'}</b></span></div><button type="button" onclick="openRouteMapModal('${escAttr(item.loading_location)}', '${escAttr(item.unloading_location)}', '${escAttr(item.id)}')" class="font-bold flex items-center gap-1 cursor-pointer">Карта маршруту<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#i-map-arrow"/></svg></button></div>
              </div>

              <!-- 3. Cargo name gets its own full-width row so long names
                   (e.g. "Кукурудза фуражна (насип)") always show in full,
                   wrapping onto a second line rather than being cut off
                   with "..." like the shorter stat cells below it. -->
              <div class="inner-cell rounded-2xl p-3 flex items-center gap-2.5 text-xs">
                <div class="w-8 h-8 rounded-lg ${cargoCfg.bg} ${cargoCfg.text} flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${cargoCfg.svg}</svg>
                </div>
                <div class="min-w-0">
                  <div class="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none mb-0.5">Вантаж</div>
                  <div class="font-bold text-slate-950 dark:text-white leading-snug break-words">${escapeHtml(item.product)}</div>
                </div>
              </div>

              <!-- 4. Headline Stats Strip: Weight, Loading date, Unloading date -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="inner-cell rounded-2xl p-2.5 flex flex-col items-start gap-1.5 min-w-0 overflow-hidden">
                  <div class="w-7 h-7 rounded-lg detail-icon flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-scale"/></svg>
                  </div>
                  <div class="min-w-0 w-full">
                    <div class="font-bold text-slate-950 dark:text-white leading-tight truncate">${escapeHtml(item.weight)}</div>
                    <div class="text-[10px] font-medium text-slate-500 dark:text-slate-400">Вага / Об'єм</div>
                  </div>
                </div>

                <div class="inner-cell rounded-2xl p-2.5 flex flex-col items-start gap-1.5 min-w-0 overflow-hidden">
                  <div class="w-7 h-7 rounded-lg detail-icon flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-calendar"/></svg>
                  </div>
                  <div class="min-w-0 w-full">
                    <div class="font-bold text-slate-950 dark:text-white leading-tight truncate">${formatDate(item.loading_date)}</div>
                    <div class="text-[10px] font-medium text-slate-500 dark:text-slate-400">Завантаження</div>
                  </div>
                </div>

              </div>

              <!-- 4. Secondary Details: Truck type + Payment -->
              <div class="grid grid-cols-2 gap-2.5 text-xs inner-cell rounded-2xl p-3.5">
                <div class="flex items-start gap-2.5">
                  <div class="w-7 h-7 rounded-lg detail-icon flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-truck"/></svg>
                  </div>
                  <div>
                    <span class="text-[10px] font-medium text-slate-600 dark:text-slate-400 block">Тип авто:</span>
                    <span class="font-bold text-slate-950 dark:text-white leading-tight">${escapeHtml(item.truck_type)} ${count > 1 ? `<b class="text-blue-brand">(${count} авто)</b>` : ''}</span>
                  </div>
                </div>

                <div class="flex items-start gap-2.5">
                  <div class="w-7 h-7 rounded-lg detail-icon flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-payment"/></svg>
                  </div>
                  <div>
                    <span class="text-[10px] font-medium text-slate-600 dark:text-slate-400 block">Оплата:</span>
                    <span class="font-bold text-slate-950 dark:text-white leading-tight">${escapeHtml(item.payment_terms || 'По сканах CMR')}</span>
                  </div>
                </div>
              </div>

              <!-- 5. Customs Clearance Details -->
              ${(item.customs_clearance_out || item.customs_clearance_in) ? `
                <div class="space-y-1.5 text-xs inner-cell rounded-2xl p-3">
                  ${item.customs_clearance_out ? `
                    <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <svg class="w-3.5 h-3.5 detail-icon-plain shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-customs-out"/></svg>
                      <span><b>Замитнення:</b> ${escapeHtml(item.customs_clearance_out)}</span>
                    </div>
                  ` : ''}
                  ${item.customs_clearance_in ? `
                    <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <svg class="w-3.5 h-3.5 detail-icon-plain shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-customs-in"/></svg>
                      <span><b>Розмитнення:</b> ${escapeHtml(item.customs_clearance_in)}</span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- 6. Quote / Notes -->
              ${item.notes ? `
                <div class="text-xs text-slate-700 dark:text-slate-300 inner-cell p-3 rounded-2xl flex items-start gap-2.5 italic leading-relaxed">
                  <span class="text-xl font-serif text-blue-brand leading-none">“</span>
                  <span>${escapeHtml(item.notes)}</span>
                </div>
              ` : ''}

            </div>

            <!-- 7. Footer: CTA -->
            <div class="pt-2 space-y-3 ticket-foot">
              <div class="flex items-center justify-end gap-3">
                ${tier === 'confirmed' ? `
                  <span class="w-full px-5 py-2.5 rounded-2xl text-xs font-bold text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-check-circle"/></svg>
                    Рейс закрито
                  </span>
                ` : `
                  <button onclick="proposeTruck('${escAttr(item.id)}')" class="w-full px-5 py-2.5 rounded-2xl text-xs font-bold text-white btn-gradient-apple active:scale-95 shadow-lg shadow-blue-brand transition-all flex items-center justify-center gap-1.5">
                    <span>Запропонувати авто</span>
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-arrow-right"/></svg>
                  </button>
                `}
              </div>

              <div class="flex items-center justify-between gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                <span>Додано: ${createdDateFormatted}</span>
                <button onclick="openStickerModal('${escAttr(item.id)}')" title="Створити стікер для соцмереж" class="w-7 h-7 rounded-xl inner-cell hover:opacity-80 active:scale-95 flex items-center justify-center text-blue-brand transition shrink-0">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-sticker"/></svg>
                </button>
              </div>

              <!-- Admin Controls -->
              ${isAdminActive ? `
                <div class="flex items-center justify-end gap-2 pt-3 border-t border-black/10 dark:border-white/10">
                  <button onclick="toggleStatus('${escAttr(item.id)}')" class="px-3 py-1.5 rounded-xl text-xs font-semibold inner-cell text-slate-800 dark:text-slate-200 hover:opacity-80 transition">${isActive ? 'Закрити' : 'Відкрити знову'}</button>
                  <button onclick="editRecord('${escAttr(item.id)}')" class="px-3 py-1.5 rounded-xl text-xs font-semibold inner-cell text-slate-800 dark:text-slate-200 hover:opacity-80 transition flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-pencil"/></svg> Редагувати
                  </button>
                  <button onclick="deleteRecord('${escAttr(item.id)}')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-500 transition flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-trash"/></svg> Видалити
                  </button>
                </div>
              ` : ''}
            </div>

          </div>
        `;
      }).join('');

      // Fetch the real driving distance for any card that's still showing
      // the straight-line placeholder (i.e. we haven't resolved this pair
      // before) - runs in the background and patches just that card's
      // distance text in place once Google answers, no re-render needed.
      list.forEach(item => {
        if (!distanceState[item.id]?.isReal) resolveRealDistance(item);
      });

      observeRouteMaps();
    }

    // Route map iframes are the single heaviest thing on this page - each
    // one is a full Google Maps embed. Loading every card's map up front
    // (even with the native `loading="lazy"` attribute, which behaves
    // inconsistently across mobile WebViews) would mean several megabytes
    // of network traffic before the user has scrolled anywhere. Instead,
    // only the map for a card that's actually near the viewport gets its
    // `src` assigned; everything else stays an inert placeholder until
    // the user scrolls close to it.
    let routeMapObserver = null;
    function observeRouteMaps() {
      if (!('IntersectionObserver' in window)) {
        // Very old browser - just load everything, better than nothing.
        document.querySelectorAll('.route-preview iframe[data-route-src]').forEach(el => {
          el.src = el.getAttribute('data-route-src');
        });
        return;
      }
      if (!routeMapObserver) {
        routeMapObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const src = el.getAttribute('data-route-src');
            if (src) {
              el.addEventListener('load', () => el.classList.remove('skeleton-shimmer'), { once: true });
              el.src = src;
              el.removeAttribute('data-route-src');
            }
            routeMapObserver.unobserve(el);
          });
        }, { rootMargin: '600px 0px' }); // start loading a bit before it's actually visible
      }
      document.querySelectorAll('.route-preview iframe[data-route-src]').forEach(el => routeMapObserver.observe(el));
    }

    // Direct Action Channels
    function proposeTruck(id) {
      const item = shipmentsData.find(s => String(s.id) === String(id));
      if (!item) return;

      const phoneDisplay = "+380989749954";
      const telUrl = "tel:+380989749954";
      
      const countNote = (item.trucks_count && item.trucks_count > 1) ? ` [Потрібно ${item.trucks_count} авто]` : '';
      const messageText = `Вітаю! Пропоную авто на заявку${countNote}:\nМаршрут: ${item.loading_location} — ${item.unloading_location}\nВантаж: ${item.product} (${item.weight})\nДата зав.: ${formatDate(item.loading_date)}`;
      const encodedMsg = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/380989749954?text=${encodedMsg}`;

      document.getElementById('proposalContent').innerHTML = `
        <div class="p-3.5 rounded-2xl inner-cell space-y-1.5 text-slate-800 dark:text-slate-200">
          <div class="font-bold text-slate-950 dark:text-white flex items-center gap-1.5 text-[13px]">
            <span class="w-2 h-2 rounded-full bg-blue-dot"></span>
            ${escapeHtml(item.loading_location)} → ${escapeHtml(item.unloading_location)}
            ${item.trucks_count > 1 ? `<span class="text-blue-brand font-extrabold ml-1">(${item.trucks_count} авто)</span>` : ''}
          </div>
          <div class="text-[11px] text-slate-600 dark:text-slate-400">Вантаж: <b class="text-slate-950 dark:text-slate-100">${escapeHtml(item.product)}</b> (${escapeHtml(item.weight)})</div>
        </div>

        <div class="space-y-2.5 pt-2">
          <a href="${telUrl}" class="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-between transition shadow-md shadow-emerald-600/20 active:scale-98">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2a9 9 0 0 1 9 9" /> <path d="M13 6a5 5 0 0 1 5 5" /> <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg></div>
              <span>Зателефонувати</span>
            </div>
            <span class="text-xs font-mono opacity-90">${phoneDisplay}</span>
          </a>

          <button type="button" onclick="dispatchViberAction('${encodedMsg}')" class="w-full py-3 px-4 rounded-2xl bg-[#7360f2] hover:bg-[#6653e0] text-white font-bold flex items-center justify-between transition shadow-md shadow-indigo-600/20 active:scale-98 cursor-pointer">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" /></svg></div>
              <span>Написати у Viber</span>
            </div>
            <span class="text-xs opacity-90">Відкрити чат →</span>
          </button>

          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold flex items-center justify-between transition shadow-md shadow-emerald-500/20 active:scale-98">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" /></svg></div>
              <span>Написати у WhatsApp</span>
            </div>
            <span class="text-xs opacity-90">Чат із заявкою →</span>
          </a>
        </div>
        
        <div id="viberCopiedNotice" class="hidden text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
          ✓ Текст заявки скопійовано! Вставте його у повідомлення в чаті Viber.
        </div>
      `;
      document.getElementById('proposalModal').classList.remove('hidden');
    }

    function dispatchViberAction(encodedText) {
      const rawText = decodeURIComponent(encodedText);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(rawText).catch(() => {});
      }
      
      const notice = document.getElementById('viberCopiedNotice');
      if (notice) notice.classList.remove('hidden');

      const viberChatDeepLink = `viber://chat?number=%2B380989749954`;
      const viberForwardDeepLink = `viber://forward?text=${encodedText}`;

      window.location.href = viberChatDeepLink;
      setTimeout(() => {
        if (document.hidden) return;
        window.location.href = viberForwardDeepLink;
      }, 1000);
    }

    function closeProposalModal() {
      document.getElementById('proposalModal').classList.add('hidden');
    }

    function handleBackdropClick(e, modalId) {
      if (e.target.id === modalId) {
        if (modalId === 'mapModal') closeMapModal();
        else if (modalId === 'stickerModal') closeStickerModal();
        else if (modalId === 'notificationModal') closeNotificationModal();
        else if (modalId === 'proposalModal') closeProposalModal();
        else if (modalId === 'shipmentModal') closeModal();
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMapModal();
        closeStickerModal();
        closeNotificationModal();
        closeProposalModal();
        closeModal();
      }
    });

    async function toggleAdminAuth() {
      if (!isAdminActive) {
        const pass = prompt('Введіть пароль адміністратора:');
        if (!pass) return;

        showToast('Перевірка пароля...');

        try {
          const res = await fetch('/api/shipments?action=verify_admin', {
            headers: { 'Authorization': `Bearer ${pass.trim()}` }
          });

          if (res.ok) {
            savedAdminKey = pass.trim();
            localStorage.setItem('logix_admin_pass', savedAdminKey);
            isAdminActive = true;
            syncAdminStateUI();
            applyFilters();
            showToast('Успішний вхід в кабінет!');
          } else {
            const data = await res.json().catch(() => ({}));
            showToast(data.error || 'Невірний пароль адміністратора!', true);
          }
        } catch (err) {
          savedAdminKey = pass.trim();
          localStorage.setItem('logix_admin_pass', savedAdminKey);
          isAdminActive = true;
          syncAdminStateUI();
          applyFilters();
          showToast('Вхід у демо-режимі');
        }
      } else {
        if (confirm('Вийти з режиму адміністратора?')) {
          localStorage.removeItem('logix_admin_pass');
          isAdminActive = false;
          savedAdminKey = '';
          syncAdminStateUI();
          applyFilters();
          showToast('Ви вийшли з кабінету');
        }
      }
    }

    function syncAdminStateUI() {
      document.getElementById('addBtn').classList.toggle('hidden', !isAdminActive);
      document.getElementById('adminBtnText').innerText = isAdminActive ? 'Вийти' : 'Кабінет';
    }

    function openShipmentModal() {
      document.getElementById('shipmentForm').reset();
      document.getElementById('editId').value = '';
      document.getElementById('contact_phone').value = '+380989749954';
      document.getElementById('trucks_count').value = '1';
      document.getElementById('modalTitle').innerText = 'Нова заявка на авто';
      document.getElementById('shipmentModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('shipmentModal').classList.add('hidden');
      document.getElementById('editId').value = '';
      document.getElementById('shipmentForm').reset();
    }

    function editRecord(id) {
      const item = shipmentsData.find(s => String(s.id) === String(id));
      if (!item) return;

      document.getElementById('editId').value = item.id;
      document.getElementById('truck_type').value = item.truck_type || '';
      document.getElementById('trucks_count').value = item.trucks_count || 1;
      document.getElementById('product').value = item.product || '';
      document.getElementById('loading_location').value = item.loading_location || '';
      document.getElementById('unloading_location').value = item.unloading_location || '';
      document.getElementById('loading_date').value = item.loading_date ? String(item.loading_date).split('T')[0] : '';
      document.getElementById('weight').value = item.weight || '';
      document.getElementById('payment_terms').value = item.payment_terms || '';
      document.getElementById('contact_phone').value = item.contact_phone || '+380989749954';
      document.getElementById('customs_clearance_out').value = item.customs_clearance_out || '';
      document.getElementById('customs_clearance_in').value = item.customs_clearance_in || '';
      document.getElementById('price').value = item.price || '';
      document.getElementById('status').value = item.status || 'active';
      document.getElementById('notes').value = item.notes || '';

      document.getElementById('modalTitle').innerText = 'Редагувати заявку';
      document.getElementById('shipmentModal').classList.remove('hidden');
    }

    async function handleFormSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('editId').value;
      const submitBtn = document.getElementById('saveSubmitBtn');
      const submitText = document.getElementById('saveSubmitText');

      const payload = {
        truck_type: document.getElementById('truck_type').value.trim(),
        trucks_count: parseInt(document.getElementById('trucks_count').value, 10) || 1,
        product: document.getElementById('product').value.trim(),
        loading_location: document.getElementById('loading_location').value.trim(),
        unloading_location: document.getElementById('unloading_location').value.trim(),
        loading_date: document.getElementById('loading_date').value,
        weight: document.getElementById('weight').value.trim(),
        payment_terms: document.getElementById('payment_terms').value.trim() || null,
        contact_phone: document.getElementById('contact_phone').value.trim() || '+380989749954',
        customs_clearance_out: document.getElementById('customs_clearance_out').value.trim() || null,
        customs_clearance_in: document.getElementById('customs_clearance_in').value.trim() || null,
        price: document.getElementById('price').value.trim() || null,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value.trim() || null
      };

      const method = id ? 'PUT' : 'POST';
      if (id) payload.id = id;

      submitBtn.disabled = true;
      submitText.innerText = 'Збереження...';

      try {
        const res = await fetch('/api/shipments', {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${savedAdminKey}`
          },
          body: JSON.stringify(payload)
        });

        const respSource = res.headers.get('X-Data-Source') || currentDataSource;
        updateDataSourceUI(respSource);

        if (res.ok) {
          const savedData = await res.json();
          closeModal();

          if (id) {
            const idx = shipmentsData.findIndex(x => String(x.id) === String(id));
            if (idx !== -1) {
              shipmentsData[idx] = { ...shipmentsData[idx], ...payload, ...savedData };
            }
          } else {
            shipmentsData.unshift(savedData);
          }

          if (respSource === 'supabase' && (!id || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(id))) {
            await fetchShipments();
          } else {
            applyFilters();
          }

          showToast('Заявку успішно збережено!');
        } else {
          const errData = await res.json().catch(() => ({}));
          showToast(errData.error || 'Помилка збереження', true);
        }
      } catch (err) {
        closeModal();
        if (id) {
          const idx = shipmentsData.findIndex(x => String(x.id) === String(id));
          if (idx !== -1) {
            shipmentsData[idx] = { ...shipmentsData[idx], ...payload };
          }
        } else {
          shipmentsData.unshift({ id: `local-${Date.now()}`, created_at: new Date().toISOString(), ...payload });
        }
        applyFilters();
        showToast('Збережено локально');
      } finally {
        submitBtn.disabled = false;
        submitText.innerText = 'Зберегти';
      }
    }

    // Єдиний спосіб закрити/відкрити заявку - рішення адміністратора.
    async function toggleStatus(id) {
      const item = shipmentsData.find(s => String(s.id) === String(id));
      if (!item) return;
      const status = item.status === 'active' ? 'completed' : 'active';
      if (status === 'completed' && !confirm('Закрити цю заявку?')) return;
      try {
        const res = await fetch('/api/shipments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${savedAdminKey}` },
          body: JSON.stringify({ id, status })
        });
        if (!res.ok) { const e = await res.json().catch(() => ({})); showToast(e.error || 'Помилка', true); return; }
      } catch (err) { /* офлайн / демо: змінюємо локально */ }
      item.status = status;
      applyFilters();
      showToast(status === 'completed' ? 'Заявку закрито' : 'Заявку відкрито знову');
    }

    async function deleteRecord(id) {
      if (!confirm('Видалити цю заявку на рейс?')) return;

      try {
        const res = await fetch(`/api/shipments?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${savedAdminKey}` }
        });

        const respSource = res.headers.get('X-Data-Source') || currentDataSource;
        updateDataSourceUI(respSource);

        shipmentsData = shipmentsData.filter(x => String(x.id) !== String(id));
        applyFilters();

        if (res.ok) {
          if (respSource === 'supabase' && /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(id)) {
            fetchShipments();
          }
          showToast('Заявку видалено');
        } else {
          showToast('Видалено локально');
        }
      } catch (err) {
        shipmentsData = shipmentsData.filter(x => String(x.id) !== String(id));
        applyFilters();
        showToast('Видалено локально');
      }
    }

    initTheme();
    fetchShipments();

    // Registers the app-shell service worker so the page (a) becomes
    // installable to the home screen - the prerequisite for the
    // address-bar-free standalone launch - and (b) paints instantly on
    // repeat visits even on a slow connection. Wrapped defensively so
    // browsers/environments without SW support (or file:// previews)
    // simply skip it instead of throwing.
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  
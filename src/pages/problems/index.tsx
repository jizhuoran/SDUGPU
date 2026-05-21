import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  HStack,
  VStack,
  Badge,
  InputGroup,
  InputLeftElement,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { Layout } from "~/components/layout";
import { api } from "~/utils/api";
import { useState, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import type { GetServerSideProps } from "next";
import { getTagName } from "~/constants/problem";
import { useHotkey } from "~/hooks/useHotKey";
import { useI18n, type Locale } from "~/i18n";
import { getProblemTitle } from "~/i18n/problem-content";

type SortField = "title" | "difficulty" | "submissionCount";
type SortDirection = "asc" | "desc";
type ProblemStatus = "all" | "solved" | "unsolved" | "attempting";
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "green";
    case "medium":
      return "yellow";
    case "hard":
      return "red";
    default:
      return "gray";
  }
};

export const formatDifficultyLabel = (
  difficulty: string,
  locale: Locale = "zh"
) => {
  if (locale === "en") {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "Easy";
      case "medium":
        return "Medium";
      case "hard":
        return "Hard";
      default:
        return difficulty;
    }
  }

  switch (difficulty.toLowerCase()) {
    case "easy":
      return "简单";
    case "medium":
      return "中等";
    case "hard":
      return "困难";
    default:
      return difficulty;
  }
};

const getDifficultyValue = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return 1;
    case "medium":
      return 2;
    case "hard":
      return 3;
    default:
      return 0;
  }
};

const SortIcon = ({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) => {
  if (sortField !== field) return null;
  return sortDirection === "asc" ? (
    <FaChevronUp color="#d4d4d8" size={10} />
  ) : (
    <FaChevronDown color="#d4d4d8" size={10} />
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  await helpers.problems.getAll.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

export default function ProblemsPage() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const { data: problems = [], isLoading } = api.problems.getAll.useQuery(
    undefined,
    {
      // Allow client to refetch so per-user flags (solved/attempted) are populated
      // after SSR prefetch (which runs with session=null).
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [problemStatusFilter, setProblemStatusFilter] =
    useState<ProblemStatus>("all");
  const [sortField, setSortField] = useState<SortField>("difficulty");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isHoveringTagClear, setIsHoveringTagClear] = useState(false);

  useHotkey("meta+f", () => {
    if (!searchInputRef.current) return;
    searchInputRef.current.focus();
    searchInputRef.current.select();
  });
  const difficultyOptions = [
    { label: t("problems.allDifficulty"), value: "all" },
    { label: t("difficulty.easy"), value: "easy" },
    { label: t("difficulty.medium"), value: "medium" },
    { label: t("difficulty.hard"), value: "hard" },
  ];

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    problems.forEach((problem) => {
      problem.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [problems]);
  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    problems.forEach((problem) => {
      problem.tags?.forEach((tag: string) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [problems]);
  const filteredTags = useMemo(() => {
    const query = tagSearchQuery.trim().toLowerCase();
    if (!query) return allTags;
    return allTags.filter((tag) => {
      const displayName = getTagName(tag, locale, true).toLowerCase();
      return tag.toLowerCase().includes(query) || displayName.includes(query);
    });
  }, [allTags, tagSearchQuery, locale]);
  const visibleTags = useMemo(() => {
    if (tagSearchQuery.trim()) return filteredTags;
    return filteredTags.filter((tag) => !popularTags.includes(tag));
  }, [filteredTags, popularTags, tagSearchQuery]);

  const statusOptions: { label: string; value: ProblemStatus }[] = [
    { label: t("problems.allStatus"), value: "all" },
    { label: t("problems.solved"), value: "solved" },
    { label: t("problems.unsolved"), value: "unsolved" },
    { label: t("problems.attempting"), value: "attempting" },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleProblemClick = (e: React.MouseEvent, problemSlug: string) => {
    const url = `/problems/${problemSlug}`;
    if (e.metaKey || e.ctrlKey) {
      window.open(url, "_blank");
    } else {
      void router.push(url);
    }
  };

  const hasSearch = searchQuery.trim().length > 0;
  const selectedTagsTooltipLabel = useMemo(() => {
    if (selectedTags.length === 0) return "";
    return selectedTags
      .map((tag) => getTagName(tag, locale, true))
      .join(", ");
  }, [selectedTags, locale]);

  const filteredAndSortedProblems = problems
    ?.filter((problem) => {
      const displayTitle = getProblemTitle(problem.slug, problem.title, locale);
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        displayTitle.toLowerCase().includes(query) ||
        problem.title.toLowerCase().includes(query) ||
        problem.slug.toLowerCase().includes(query);
      const matchesDifficulty =
        difficultyFilter === "all" ||
        problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => problem.tags?.includes(tag));

      const matchesStatus = (() => {
        switch (problemStatusFilter) {
          case "all":
            return true;
          case "solved":
            return !!problem.solvedByCurrentUser;
          case "unsolved":
            return !problem.solvedByCurrentUser;
          case "attempting":
            return !!problem.attemptedByCurrentUser;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
    })
    .sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "title":
          return (
            multiplier *
            getProblemTitle(a.slug, a.title, locale).localeCompare(
              getProblemTitle(b.slug, b.title, locale)
            )
          );
        case "difficulty": {
          const diffComparison =
            multiplier *
            (getDifficultyValue(a.difficulty) -
              getDifficultyValue(b.difficulty));
          if (diffComparison === 0) {
            return b.submissionCount - a.submissionCount;
          }
          return diffComparison;
        }
        case "submissionCount":
          return multiplier * (a.submissionCount - b.submissionCount);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <Layout title={t("problems.title")}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="50vh"
        >
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout
      title={t("problems.title")}
      ogTitle={`${t("problems.title")} | SDUGPU`}
      ogDescription={t("problems.og")}
    >
      <Box maxW="7xl" mx="auto" px={4} py={8}>
        <VStack spacing={6} align="stretch" w="full">
          <HStack spacing={4} w="full" justify="space-between">
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="#d4d4d8" />
              </InputLeftElement>
              <Input
                ref={searchInputRef}
                placeholder={t("problems.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="whiteAlpha.50"
                _hover={{ borderColor: "gray.600" }}
                _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                color="white"
              />
            </InputGroup>

            <HStack spacing={4} justify="flex-end" flexWrap="wrap">
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FaChevronDown color="#d4d4d8" size={10} />}
                  bg="whiteAlpha.50"
                  _hover={{ bg: "whiteAlpha.100", borderColor: "gray.600" }}
                  _active={{ bg: "whiteAlpha.150" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                  color="white"
                  w="200px"
                  fontWeight="normal"
                  textAlign="left"
                  justifyContent="flex-start"
                >
                  {difficultyOptions.find(
                    (opt) => opt.value === difficultyFilter
                  )?.label ?? t("problems.allDifficulty")}
                </MenuButton>
                <MenuList
                  bg="brand.secondary"
                  borderColor="gray.800"
                  p={0}
                  borderRadius="md"
                  minW="200px"
                >
                  {difficultyOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() => setDifficultyFilter(option.value)}
                      bg="brand.secondary"
                      _hover={{ bg: "gray.700" }}
                      color="white"
                      borderRadius="md"
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Menu closeOnSelect={false}>
                <Tooltip
                  label={selectedTagsTooltipLabel}
                  hasArrow
                  placement="top"
                  openDelay={250}
                  isDisabled={selectedTags.length === 0 || isHoveringTagClear}
                  bg="brand.secondary"
                  color="gray.100"
                >
                  <MenuButton
                    as={Button}
                    rightIcon={
                      <HStack spacing={2}>
                        {selectedTags.length > 0 ? (
                          <Box
                            role="button"
                            aria-label={t("problems.clearTags")}
                            tabIndex={0}
                            onMouseEnter={() => setIsHoveringTagClear(true)}
                            onMouseLeave={() => setIsHoveringTagClear(false)}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedTags([]);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedTags([]);
                              }
                            }}
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            w="18px"
                            h="18px"
                            borderRadius="sm"
                          >
                            <FaTimes
                              color={isHoveringTagClear ? "white" : "#d4d4d8"}
                              size={10}
                            />
                          </Box>
                        ) : null}
                        <FaChevronDown color="#d4d4d8" size={10} />
                      </HStack>
                    }
                    bg="whiteAlpha.50"
                    _hover={{ bg: "whiteAlpha.100", borderColor: "gray.600" }}
                    _active={{ bg: "whiteAlpha.150" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                    color="white"
                    w="200px"
                    fontWeight="normal"
                    textAlign="left"
                    justifyContent="flex-start"
                  >
                    {selectedTags.length === 0
                      ? t("problems.allTags")
                      : t("problems.tagCount", { count: selectedTags.length })}
                  </MenuButton>
                </Tooltip>
                <MenuList
                  bg="brand.secondary"
                  borderColor="gray.800"
                  p={0}
                  minW="200px"
                  maxH="380px"
                  overflowY="auto"
                >
                  <Box px={3} py={2}>
                    <Input
                      size="sm"
                      placeholder={t("problems.searchTags")}
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      bg="whiteAlpha.100"
                      _hover={{ borderColor: "gray.600" }}
                      _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                      color="white"
                    />
                  </Box>
                  {!tagSearchQuery.trim() && popularTags.length > 0 ? (
                    <>
                      {popularTags.map((tag: string) => (
                        <MenuItem
                          key={`popular-${tag}`}
                          onClick={() =>
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag]
                            )
                          }
                          bg="brand.secondary"
                          _hover={{ bg: "gray.700" }}
                          color="white"
                          borderRadius="md"
                        >
                          <HStack w="full" justify="space-between">
                            <Text>
                              {getTagName(tag, locale, true)}
                            </Text>
                            {selectedTags.includes(tag) ? (
                              <FaCheckCircle
                                color="#4ade80"
                                size={12}
                                opacity={0.68}
                              />
                            ) : null}
                          </HStack>
                        </MenuItem>
                      ))}
                      <Divider borderColor="gray.700" my={1} />
                    </>
                  ) : null}
                  {visibleTags.map((tag: string) => (
                    <MenuItem
                      key={tag}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                      bg="brand.secondary"
                      _hover={{ bg: "gray.700" }}
                      color="white"
                      borderRadius="md"
                    >
                      <HStack w="full" justify="space-between">
                        <Text>
                          {getTagName(tag, locale, true)}
                        </Text>
                        {selectedTags.includes(tag) ? (
                          <FaCheckCircle
                            color="#4ade80"
                            size={12}
                            opacity={0.68}
                          />
                        ) : null}
                      </HStack>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              {session?.user ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FaChevronDown color="#d4d4d8" size={10} />}
                    bg="whiteAlpha.50"
                    _hover={{ bg: "whiteAlpha.100", borderColor: "gray.600" }}
                    _active={{ bg: "whiteAlpha.150" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                    color="white"
                    w="160px"
                    fontWeight="normal"
                    textAlign="left"
                    justifyContent="flex-start"
                  >
                    {statusOptions.find(
                      (opt) => opt.value === problemStatusFilter
                    )?.label ?? t("problems.status")}
                  </MenuButton>
                  <MenuList
                    bg="brand.secondary"
                    borderColor="gray.800"
                    p={0}
                    minW="160px"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => setProblemStatusFilter(option.value)}
                        bg="brand.secondary"
                        _hover={{ bg: "gray.700" }}
                        color="white"
                        borderRadius="md"
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              ) : null}
            </HStack>
          </HStack>

          <Text color="gray.400" fontSize="sm">
            {t("problems.count", {
              total: problems?.length ?? 0,
              shown: filteredAndSortedProblems?.length ?? 0,
            })}
          </Text>

          <Box
            overflowX="auto"
            borderRadius="xl"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            {filteredAndSortedProblems.length ? (
              <Table variant="simple">
                <Thead bg="brand.card">
                  <Tr>
                    <Th
                      color="gray.300"
                      fontSize="md"
                      py={4}
                      borderBottom="1px solid"
                      borderColor="brand.primary"
                      cursor="pointer"
                      onClick={() => handleSort("title")}
                      _hover={{ color: "white" }}
                    >
                      <HStack spacing={2}>
                        <Box
                          display="inline-flex"
                          alignItems="center"
                          justifyContent="center"
                          minW="18px"
                          minH="18px"
                        >
                          <Box w="16px" h="16px" />
                        </Box>
                        <Text>{t("problems.table.problem")}</Text>
                        <SortIcon
                          field="title"
                          sortField={sortField}
                          sortDirection={sortDirection}
                        />
                      </HStack>
                    </Th>
                    <Th
                      color="gray.300"
                      fontSize="md"
                      width="180px"
                      borderBottom="1px solid"
                      borderColor="brand.primary"
                      cursor="pointer"
                      onClick={() => handleSort("difficulty")}
                      _hover={{ color: "white" }}
                    >
                      <HStack spacing={2}>
                        <Text>{t("problems.table.difficulty")}</Text>
                        <SortIcon
                          field="difficulty"
                          sortField={sortField}
                          sortDirection={sortDirection}
                        />
                      </HStack>
                    </Th>
                    <Th
                      color="gray.300"
                      fontSize="md"
                      width="180px"
                      borderBottom="1px solid"
                      borderColor="brand.primary"
                      cursor="pointer"
                      _hover={{ color: "white" }}
                    >
                      {t("problems.table.tags")}
                    </Th>
                    <Th
                      color="gray.300"
                      fontSize="md"
                      width="200px"
                      display={{ base: "none", md: "table-cell" }}
                      borderBottom="1px solid"
                      borderColor="brand.primary"
                      cursor="pointer"
                      onClick={() => handleSort("submissionCount")}
                      _hover={{ color: "white" }}
                    >
                      <HStack spacing={2}>
                        <Text>{t("problems.table.submissions")}</Text>
                        <SortIcon
                          field="submissionCount"
                          sortField={sortField}
                          sortDirection={sortDirection}
                        />
                      </HStack>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredAndSortedProblems?.map((problem) => (
                    <Tr
                      bg="brand.secondary"
                      key={problem.id}
                      _hover={{ bg: "gray.700", transform: "translateY(-1px)" }}
                      transition="all 0.2s"
                      cursor="pointer"
                      onClick={(e) => handleProblemClick(e, problem.slug)}
                      borderBottom="1px solid"
                      borderColor="gray.800"
                    >
                      <Td color="white" borderBottom="none">
                        <HStack spacing={3} align="center">
                          <Box
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            minW="18px"
                            minH="18px"
                          >
                            {problem.solvedByCurrentUser ? (
                              <FaCheckCircle
                                color="#4ade80"
                                size={16}
                                opacity={0.68}
                              />
                            ) : problem.attemptedByCurrentUser ? (
                              <FaClock
                                color="#fbbf24"
                                size={16}
                                opacity={0.68}
                              />
                            ) : (
                              // empty placeholder to preserve alignment
                              <Box w="16px" h="16px" />
                            )}
                          </Box>
                          <Text>
                            {getProblemTitle(problem.slug, problem.title, locale)}
                          </Text>
                        </HStack>
                      </Td>
                      <Td borderBottom="none">
                        <Badge
                          colorScheme={getDifficultyColor(problem.difficulty)}
                          px={2}
                          py={0.5}
                          borderRadius="md"
                        >
                          {formatDifficultyLabel(problem.difficulty, locale)}
                        </Badge>
                      </Td>
                      <Td color="white" borderBottom="none">
                        {problem.tags && problem.tags.length > 0 && (
                          <HStack spacing={1} flex="0 0 auto">
                            {problem.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                bg="transparent"
                                color="gray.100"
                                variant="solid"
                                fontSize="xs"
                                px={2}
                                py={0.5}
                                borderRadius="full"
                                title={
                                  getTagName(tag, locale, true)
                                }
                              >
                                {getTagName(tag, locale)}
                              </Badge>
                            ))}
                          </HStack>
                        )}
                      </Td>
                      <Td borderBottom="none">
                        <Text color="gray.400" fontSize="sm">
                          {problem.submissionCount}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <VStack py={12} px={6} spacing={3} align="center">
                <Text color="white" fontSize="lg" fontWeight="600">
                  {hasSearch
                    ? t("problems.empty.search")
                    : t("problems.empty.none")}
                </Text>
                <Text color="whiteAlpha.700" textAlign="center">
                  {t("problems.empty.hint")}
                </Text>
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Layout>
  );
}
